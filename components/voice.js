/**
 * NKVoice – Vorlese-Service für Nasenklammer
 *
 * Kapselt die gesamte Text-to-Speech-Logik hinter einer einzigen API.
 * Der verwendete Provider kann zentral gewechselt werden – alle Module
 * (uhr.html, rechnen.html, …) bleiben dabei unverändert.
 *
 * ── Verwendung ──────────────────────────────────────────────────────
 *
 *   NKVoice.speak("Schau dir die Uhr an …");
 *   NKVoice.stop();
 *   NKVoice.isSpeaking();   // → true/false
 *
 * ── Provider wechseln ───────────────────────────────────────────────
 *
 *   // ElevenLabs (hochwertige Stimmen, empfohlen):
 *   NKVoice.configure('elevenlabs', {
 *     apiKey:  'sk-…',
 *     voiceId: 'de-DE-KinderStimme',   // aus ElevenLabs-Dashboard
 *   });
 *
 *   // OpenAI TTS:
 *   NKVoice.configure('openai', {
 *     apiKey: 'sk-…',
 *     voice:  'nova',   // 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
 *     model:  'tts-1',  // oder 'tts-1-hd' für höhere Qualität
 *   });
 *
 *   // Zurück zum Browser (default):
 *   NKVoice.configure('browser');
 *
 * ── Hinweis API-Key-Sicherheit ───────────────────────────────────────
 *   API-Keys im Frontend sind sichtbar. Für Produktiv-Einsatz einen
 *   kleinen Proxy-Endpunkt (z. B. Netlify Function) vorschalten, der
 *   den Key serverseitig hält. configure() bleibt dann identisch –
 *   nur die apiKey-Option entfällt bzw. zeigt auf den Proxy-URL.
 */

/* global NKVoice */
(function (root) {
  'use strict';

  /* ── Interne Provider-Implementierungen ────── */

  var providers = {

    /* ── Browser speechSynthesis (default) ──── */
    browser: {
      _utterance: null,

      speak: function (text, onEnd) {
        if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'de-DE';
        u.onend = onEnd || null;
        this._utterance = u;
        window.speechSynthesis.speak(u);
      },

      stop: function () {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      },

      isSpeaking: function () {
        return 'speechSynthesis' in window && window.speechSynthesis.speaking;
      }
    },

    /* ── ElevenLabs ─────────────────────────── */
    elevenlabs: {
      _audio: null,

      speak: function (text, onEnd, cfg) {
        var self = this;
        this.stop();

        fetch('https://api.elevenlabs.io/v1/text-to-speech/' + cfg.voiceId, {
          method:  'POST',
          headers: {
            'xi-api-key':   cfg.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text:           text,
            model_id:       cfg.model || 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        })
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          var url   = URL.createObjectURL(blob);
          var audio = new Audio(url);
          self._audio = audio;
          audio.onended = function () {
            URL.revokeObjectURL(url);
            self._audio = null;
            if (onEnd) onEnd();
          };
          audio.play();
        })
        .catch(function (err) {
          console.warn('NKVoice ElevenLabs error:', err);
          if (onEnd) onEnd();
        });
      },

      stop: function () {
        if (this._audio) { this._audio.pause(); this._audio = null; }
      },

      isSpeaking: function () {
        return !!(this._audio && !this._audio.paused);
      }
    },

    /* ── OpenAI TTS ─────────────────────────── */
    openai: {
      _audio: null,

      speak: function (text, onEnd, cfg) {
        var self = this;
        this.stop();

        fetch('https://api.openai.com/v1/audio/speech', {
          method:  'POST',
          headers: {
            'Authorization': 'Bearer ' + cfg.apiKey,
            'Content-Type':  'application/json',
          },
          body: JSON.stringify({
            model: cfg.model || 'tts-1',
            input: text,
            voice: cfg.voice || 'nova',
          }),
        })
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          var url   = URL.createObjectURL(blob);
          var audio = new Audio(url);
          self._audio = audio;
          audio.onended = function () {
            URL.revokeObjectURL(url);
            self._audio = null;
            if (onEnd) onEnd();
          };
          audio.play();
        })
        .catch(function (err) {
          console.warn('NKVoice OpenAI error:', err);
          if (onEnd) onEnd();
        });
      },

      stop: function () {
        if (this._audio) { this._audio.pause(); this._audio = null; }
      },

      isSpeaking: function () {
        return !!(this._audio && !this._audio.paused);
      }
    }

  };

  /* ── Öffentliche API ────────────────────────── */

  var NKVoice = {
    _providerKey: 'browser',
    _config:      {},

    /**
     * Provider wechseln.
     * @param {'browser'|'elevenlabs'|'openai'} providerKey
     * @param {Object} [config]  API-Key und Voice-Optionen (je nach Provider)
     */
    configure: function (providerKey, config) {
      this.stop();
      this._providerKey = providerKey || 'browser';
      this._config      = config || {};
    },

    /**
     * Text vorlesen.
     * @param {string}   text
     * @param {Function} [onEnd]  Callback wenn Wiedergabe beendet
     */
    speak: function (text, onEnd) {
      var p = providers[this._providerKey] || providers.browser;
      p.speak(text, onEnd || null, this._config);
    },

    /** Aktuelle Wiedergabe stoppen. */
    stop: function () {
      var p = providers[this._providerKey] || providers.browser;
      p.stop();
    },

    /** Gibt true zurück wenn gerade gesprochen wird. */
    isSpeaking: function () {
      var p = providers[this._providerKey] || providers.browser;
      return p.isSpeaking();
    }
  };

  root.NKVoice = NKVoice;

}(typeof window !== 'undefined' ? window : this));
