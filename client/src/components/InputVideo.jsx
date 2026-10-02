import { FaVideo, FaCheckCircle } from "react-icons/fa"
import { MdFileUpload } from "react-icons/md"
import { PiSpinnerGapBold } from "react-icons/pi"
import { useContext, useState, useRef } from "react"
import { SummeryContext } from "../context/summeryContext"

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]
const MAX_SIZE_MB = 100

const InputVideo = () => {
    const [video, setVideo] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [validationError, setValidationError] = useState("")
    const { fetchSummary, loading } = useContext(SummeryContext)
    const inputRef = useRef(null)

    const validateFile = (file) => {
        if (!file) return "No file selected."
        if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
            return `Unsupported format "${file.type}". Please use MP4, WebM, MOV, or AVI.`
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max size is ${MAX_SIZE_MB} MB.`
        }
        return ""
    }

    const handleFileChange = (file) => {
        const err = validateFile(file)
        setValidationError(err)
        setVideo(err ? null : file)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileChange(file)
    }

    const handleSubmit = async () => {
        if (!video) {
            setValidationError("Please select a video file first.")
            return
        }
        await fetchSummary("video", video)
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }

    return (
        <div className="w-full py-6 space-y-4">
            {/* Drop zone */}
            <div
                className={`w-full p-6 sm:p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
                    ${dragOver ? "border-blue-500 bg-blue-50" : video ? "border-green-400 bg-green-50/40" : "border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !loading && inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && !loading && inputRef.current?.click()}
                aria-label="Upload video file"
            >
                <div className="flex flex-col items-center text-center gap-3">
                    {/* Icon */}
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl border shadow-sm transition
                        ${video ? "border-green-200 bg-white text-green-500" : "border-blue-100 bg-white text-blue-500"}`}>
                        {video ? <FaCheckCircle size={28} /> : <FaVideo size={28} />}
                    </div>

                    {/* Status text */}
                    {video ? (
                        <div>
                            <p className="text-sm font-semibold text-slate-700 truncate max-w-xs">{video.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(video.size)} · Ready to transcribe</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm font-semibold text-slate-700">
                                {dragOver ? "Drop your video here" : "Upload your video"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Drag & drop or click to browse · MP4, WebM, MOV, AVI · Max {MAX_SIZE_MB} MB
                            </p>
                        </div>
                    )}

                    {/* Browse button */}
                    {!loading && (
                        <span className="mt-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
                            {video ? "Change Video" : "Choose Video"}
                        </span>
                    )}
                </div>

                <input
                    ref={inputRef}
                    id="video-upload"
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    disabled={loading}
                />
            </div>

            {/* Validation error */}
            {validationError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2" role="alert">
                    {validationError}
                </p>
            )}

            {/* Info note */}
            {video && !validationError && !loading && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
                    <strong>How it works:</strong> Your video will be transcribed using AI speech-to-text, then summarized. This may take 1-3 minutes for large videos.
                </div>
            )}

            {/* Loading progress notice */}
            {loading && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 flex items-center gap-2">
                    <PiSpinnerGapBold className="animate-spin shrink-0 text-blue-600" size={16} />
                    <span>Uploading & transcribing video with AI speech-to-text. For larger files (~20MB), this takes about 2-3 minutes. Please wait...</span>
                </div>
            )}

            {/* Submit */}
            <button
                type="button"
                onClick={handleSubmit}
                disabled={!video || loading || !!validationError}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <PiSpinnerGapBold className="animate-spin" size={18} />
                        Transcribing & Summarizing…
                    </>
                ) : (
                    <>
                        <MdFileUpload size={18} />
                        Transcribe & Summarize
                    </>
                )}
            </button>
        </div>
    )
}

export default InputVideo
