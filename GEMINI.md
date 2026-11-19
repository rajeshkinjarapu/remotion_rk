# REMOTION_RK PROJECT RULE BOOK & GUIDELINES

## 🚨 1. MANDATORY IMAGE POLICY (STRICT ORDER)
- **NO ONLINE / WEB IMAGES:** 
  - Never fetch, search, download, or use images from the internet or online URLs. 
  - Never use external image CDNs or AI image generators unless explicitly requested.
- **ONLY USER-PROVIDED LOCAL IMAGES:** 
  - ONLY use images provided directly by the user stored in the local project directory (under `public/images/<topic>/`).
  - This rule applies universally to EVERY video and composition in this repository (Political videos, Cricket analysis, Telugu Quiz, Travel videos, etc.).
- **IMAGE REQUIREMENTS LIST BEFORE SCRIPTING:**
  - Before writing or finalizing any video script, storyboard, chapter list, or Remotion composition code, ALWAYS provide a comprehensive, structured list of all required images to the user.
  - The list must include:
    1. Chapter / Scene number & title
    2. Exact subject / person / event needed
    3. Recommended target folder & filename (e.g., `public/images/<topic>/<filename>`)
    4. Ideal format (e.g., Portrait 3:4, Transparent PNG cutout, or High-res photo)
  - Allow the user to review and place their own chosen images into the specified folders before finalizing.

---

## 🎨 2. UI & CARD LAYOUT STANDARDS
- **Full Card Coverage (Full-Bleed):** When player or leader cards are used, the image must fill/cover the entire designated card frame cleanly (`objectFit: 'cover'`) without leaving empty top or bottom dead space or awkward floating shapes.
- **No Text or Number Clipping:** Generous line heights, responsive font sizes, and container padding must be maintained so Telugu glyphs, percentages (`%`), margins, and candidate/player names never get cut off at card or screen boundaries.
- **High-Contrast Text Badges:** Badges, nameplates, and subtitles on top of full-bleed images must always have seamless gradient overlays or translucent frosted backing for maximum legibility.

---

## 🎙️ 3. AUDIO-VISUAL SYNC
- Every chapter or section must be synchronized with exact audio timestamps/durations measured from voiceover files.
- Visual beats, transitions, and bullet points must trigger in rhythm with narration.
