import logging
from app.hardware.websocket_manager import ws_manager
from app.hardware.protocol import DeviceState
from app.services.stt_service import stt_service
from app.services.rag_service import rag_service
from app.services.llm_service import llm_service
from app.services.tts_service import tts_service
from app.services.citation_service import citation_service
from app.services.language_service import language_service

logger = logging.getLogger("sahayak.esp32_manager")

class ESP32Manager:
    async def process_audio_frame(self, device_id: str, audio_bytes: bytes):
        """Process incoming raw I2S PCM audio frame from ESP32 mic."""
        logger.info(f"Received {len(audio_bytes)} audio bytes from ESP32 '{device_id}'")

        # 1. Update ESP32 OLED state -> THINKING
        await ws_manager.send_esp32_state(device_id, DeviceState.THINKING)

        # 2. Convert speech to text
        query_text, detected_lang = stt_service.transcribe_audio(audio_bytes)
        logger.info(f"ESP32 Audio Transcribed: '{query_text}' (Lang: {detected_lang})")

        # 3. RAG Retrieval
        context_chunks, score = rag_service.retrieve_context(query_text)
        citations = citation_service.build_citations(context_chunks)

        # 4. LLM Generation
        answer_text = await llm_service.generate_answer(query_text, context_chunks, score, language=detected_lang)
        logger.info(f"LLM Response Generated: '{answer_text}'")

        # 5. TTS Audio Synthesis
        await ws_manager.send_esp32_state(device_id, DeviceState.SPEAKING)
        tts_audio = tts_service.synthesize_speech(answer_text, lang=detected_lang)

        # 6. Stream audio back to ESP32 websocket & broadcast response to frontend
        if device_id in ws_manager.esp32_devices:
            ws = ws_manager.esp32_devices[device_id]["ws"]
            try:
                # Send text payload message
                await ws.send_json({"type": "answer", "text": answer_text, "language": detected_lang})
                # Send TTS audio bytes
                if tts_audio:
                    await ws.send_bytes(tts_audio)
            except Exception as e:
                logger.error(f"Error streaming TTS to ESP32 ({e})")

        # Notify frontend web client
        await ws_manager.broadcast_to_clients({
            "type": "esp32_voice_result",
            "device_id": device_id,
            "query": query_text,
            "answer": answer_text,
            "language": detected_lang,
            "sources": [c.model_dump() for c in citations],
            "confidence": round(score, 2)
        })

        # Return ESP32 OLED state -> IDLE
        await ws_manager.send_esp32_state(device_id, DeviceState.IDLE)

esp32_manager = ESP32Manager()
