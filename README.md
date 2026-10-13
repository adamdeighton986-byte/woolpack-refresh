# The Woolpack Quiz — Render online trial

A **single-venue** 50-question quiz. Each question lasts 20 seconds, with a 30-second break between questions. Answers and scores are hidden until the end; the quizmaster reveals third, second, then first place, and finally publishes all scores and correct answers.

## Simple online setup (no Node.js installation required)

1. Create a free account at https://github.com and sign in.
2. Create a **new private repository**, e.g. `woolpack-quiz-trial`.
3. Extract this ZIP. In the new GitHub repository choose **Add file → Upload files**, then drag **the contents** of this extracted folder into GitHub (including the `public` folder and `render.yaml`). Commit the files. If GitHub's upload interface doesn't preserve the `public` folder structure, use GitHub Desktop to publish the extracted folder instead.
4. Sign up or sign in at https://dashboard.render.com using GitHub and authorise access to your repository.
5. In Render choose **New → Blueprint**, connect your GitHub repository and select `render.yaml` when prompted. Approve the proposed `woolpack-quiz-trial` web service. The blueprint sets the Node.js start command and generates a secret admin key.
6. Wait for the deploy to say **Live**. Open the `https://...onrender.com` address displayed on your Render service page.
7. In Render, open the web service **Environment** tab, find `ADMIN_KEY`, and use its secret value in the **Quizmaster** tab of the app. Never share it with players or show it on the TV.
8. Open the app URL on a second screen and select **TV screen**. On players' phones, open the same URL or scan the join QR code shown in the app. Everyone can join from anywhere with internet access.
9. On Quizmaster, keep question time at 20 seconds and break at 30 seconds; start once. After Q50, use the manual reveal buttons in order: **3rd → 2nd → 1st → Reveal all scores**.

## Important limitations of free Render hosting

- The free service may **spin down when idle**, making the first visit slow. Wake it by opening the app several minutes before your trial.
- The app currently stores quiz data in `data.json` on the server's **ephemeral filesystem**. A restart, redeployment, or spin-down can erase the game, teams and results. **Do not rely on this for a real event or paid competition.** A durable database is required for production.
- Free hosting has resource limits and is not intended for a crowded live event. Test with a few phones first.
- This is a pilot, not a security-audited commercial system. The admin key is required for quizmaster actions. Avoid showing the admin tab on the public TV.
- If you need to test the entire winners' ceremony quickly, change the question and break timers to 5 seconds in the quizmaster settings before starting (50 questions will still take several minutes).

## Local fallback

With Node.js 18+ installed, run `npm start` from this folder, then open http://localhost:3000. Local phones need the host computer's LAN IP address instead.
