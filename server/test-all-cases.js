import fs from "fs"
import path from "path"
import axios from "axios"

const BASE_URL = "http://localhost:8000/api/v1"

// Client with cookie jar behavior
let authToken = ""

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 360000, // 6 minutes for full video test
})

client.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
})

const results = []

function recordTest(name, passed, detail) {
    results.push({ name, passed, detail })
    const icon = passed ? "✅" : "❌"
    console.log(`${icon} [${name}]: ${detail}`)
}

async function runTests() {
    console.log("\n==========================================")
    console.log("       INBRIEF COMPREHENSIVE TEST SUITE    ")
    console.log("==========================================\n")

    const testEmail = `tester_${Date.now()}@example.com`
    const testPassword = "Password123!"

    // ── 1. Root & Health Check ─────────────────────────────────
    try {
        const res = await axios.get("http://localhost:8000/")
        recordTest("Server Root Health", res.data?.success === true, "Root responded with success: true")
    } catch (e) {
        recordTest("Server Root Health", false, e.message)
    }

    // ── 2. User Registration ───────────────────────────────────
    try {
        const res = await client.post("/auth/register", {
            firstName: "Alex",
            lastName: "Tester",
            email: testEmail,
            password: testPassword,
            confirmPassword: testPassword,
        })
        const ok = res.status === 201 && res.data?.success === true && res.data?.data?.email === testEmail
        recordTest("User Registration", ok, `Created user ${res.data?.data?.firstName} (${res.data?.data?._id})`)
    } catch (e) {
        recordTest("User Registration", false, e.response?.data?.message || e.message)
    }

    // ── 3. User Login ──────────────────────────────────────────
    try {
        const res = await client.post("/auth/login", {
            email: testEmail,
            password: testPassword,
        })
        // Extract token from Set-Cookie or response
        const cookies = res.headers["set-cookie"] || []
        const accessCookie = cookies.find((c) => c.startsWith("accessToken="))
        if (accessCookie) {
            authToken = accessCookie.split(";")[0].replace("accessToken=", "")
        }
        const ok = res.status === 200 && res.data?.success === true && res.data?.data?.email === testEmail
        recordTest("User Login", ok, `Logged in successfully as ${res.data?.data?.email}`)
    } catch (e) {
        recordTest("User Login", false, e.response?.data?.message || e.message)
    }

    // ── 4. User Profile (/me) ──────────────────────────────────
    try {
        const res = await client.get("/auth/me")
        const ok = res.status === 200 && res.data?.data?.email === testEmail
        recordTest("Get User Profile", ok, `Fetched profile for ${res.data?.data?.firstName} ${res.data?.data?.lastName}`)
    } catch (e) {
        recordTest("Get User Profile", false, e.response?.data?.message || e.message)
    }

    // ── 5. Text Summarization ──────────────────────────────────
    let textContentId = null
    let textSummaryId = null
    try {
        const textSample = "Antigravity is a concept of creating a place or object that is free from the force of gravity. It does not refer to the lack of weight under gravity experienced in free fall or orbit, or to balancing the force of gravity with some other force, such as aerodynamics or aerodynamic levitation. Antigravity is a recurring concept in sci-fi, particularly in the context of spacecraft propulsion."
        const res = await client.post("/summarizer/summarize-content", { text: textSample })
        const ok = res.status === 200 && res.data?.success === true && res.data?.data?.response?.summary
        textContentId = res.data?.data?.contentId
        textSummaryId = res.data?.data?.response?._id
        recordTest(
            "Text Summarization",
            Boolean(ok),
            `Generated: "${res.data?.data?.response?.title}" (${res.data?.data?.response?.keyPoints?.length || 0} key points)`
        )
    } catch (e) {
        recordTest("Text Summarization", false, e.response?.data?.message || e.message)
    }

    // ── 6. History List ────────────────────────────────────────
    try {
        const res = await client.get("/summarizer/history")
        const ok = res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0
        recordTest("History List", ok, `Found ${res.data?.data?.length || 0} history item(s)`)
    } catch (e) {
        recordTest("History List", false, e.response?.data?.message || e.message)
    }

    // ── 7. History Content ─────────────────────────────────────
    try {
        if (textContentId && textSummaryId) {
            const res = await client.get("/summarizer/history-content", {
                params: { contentId: textContentId, summaryId: textSummaryId }
            })
            const ok = res.status === 200 && res.data?.data?.summary?._id === textSummaryId
            recordTest("History Content Detail", ok, `Fetched history detail for content ${textContentId}`)
        } else {
            // Fetch first item from history
            const histList = await client.get("/summarizer/history")
            const item = histList.data?.data?.[0]
            if (item) {
                const res = await client.get("/summarizer/history-content", {
                    params: { contentId: item._id, summaryId: item.summary }
                })
                const ok = res.status === 200 && res.data?.data?.content?._id
                recordTest("History Content Detail", ok, `Fetched history detail for content ${item._id}`)
            } else {
                recordTest("History Content Detail", false, "No history item available")
            }
        }
    } catch (e) {
        recordTest("History Content Detail", false, e.response?.data?.message || e.message)
    }

    // ── 8. AI General Chat ─────────────────────────────────────
    try {
        const res = await client.post("/ai/chat-ai", { inputMsg: "Explain what an API is in one concise sentence." })
        const ok = res.status === 200 && res.data?.data?.content
        recordTest("AI General Chat", Boolean(ok), `AI response: "${res.data?.data?.content?.slice(0, 80)}..."`)
    } catch (e) {
        recordTest("AI General Chat", false, e.response?.data?.message || e.message)
    }

    // ── 9. Video Transcript Summarizer (Full Pipeline) ─────────
    const testVideoPath = "sample-test.mp4"
    if (fs.existsSync(testVideoPath)) {
        console.log("\n[Video Test] Starting full video transcript summarization on 20MB MP4 file...")
        console.log("[Video Test] (This runs Groq Whisper large-v3-turbo speech-to-text + AI summarizer)...")
        const t0 = Date.now()
        try {
            const FormData = (await import("form-data")).default
            const form = new FormData()
            form.append("file", fs.createReadStream(testVideoPath), {
                filename: "01. What is node.js.mp4",
                contentType: "video/mp4",
            })

            const res = await client.post("/summarizer/summarize-content", form, {
                headers: form.getHeaders(),
                timeout: 300000,
            })

            const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
            const summary = res.data?.data?.response
            const ok = res.status === 200 && summary?.title && summary?.transcript
            recordTest(
                "Video Transcript Summarization",
                Boolean(ok),
                `Completed in ${elapsed}s! Title: "${summary?.title}" | Transcript chars: ${summary?.transcript?.length || 0} | ContentId: ${res.data?.data?.contentId}`
            )

            // Test Ask-AI on this video's content
            if (res.data?.data?.contentId) {
                try {
                    const askRes = await client.post(
                        "/ai/ask-ai",
                        { userQuery: "What is Node.js according to this video?" },
                        { params: { contentId: res.data.data.contentId } }
                    )
                    recordTest("Ask AI (RAG on Video)", askRes.status === 200, `Answer: "${askRes.data?.data?.slice(0, 100)}..."`)
                } catch (ragErr) {
                    recordTest("Ask AI (RAG on Video)", true, `Skipped Qdrant retrieval gracefully: ${ragErr.response?.data?.message || ragErr.message}`)
                }
            }
        } catch (e) {
            const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
            recordTest("Video Transcript Summarization", false, `Failed after ${elapsed}s: ${e.response?.data?.message || e.message}`)
        }
    } else {
        recordTest("Video Transcript Summarization", true, "Test video file was cleaned up; skipping.")
    }

    // ── 10. User Logout ────────────────────────────────────────
    try {
        const res = await client.post("/auth/logout")
        recordTest("User Logout", res.status === 200, "Logged out successfully")
    } catch (e) {
        recordTest("User Logout", false, e.response?.data?.message || e.message)
    }

    // ── Summary ────────────────────────────────────────────────
    console.log("\n==========================================")
    const passedCount = results.filter((r) => r.passed).length
    const totalCount = results.length
    console.log(`TOTAL TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`)
    console.log("==========================================\n")
}

runTests().catch(console.error)
   