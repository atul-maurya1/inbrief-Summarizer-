import { MdHistory } from "react-icons/md"

const HistoryContent = ({ historyContent }) => {
	const summary = historyContent?.summary
	const content = historyContent?.content
	const sourceUrl = content?.url || content?.fileUrl
	const isSafeSourceUrl = /^https?:\/\//i.test(sourceUrl || "")

	return (
		<div className="space-y-4">
			<header className="flex items-start gap-3 border-b border-slate-200 pb-4">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
					<MdHistory size={22} />
				</div>
				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Saved history</p>
					<h2 className="mt-1 wrap-break-word text-lg font-semibold text-slate-800">
						{summary?.title || "Untitled summary"}
					</h2>
				</div>
			</header>

			<section className="rounded-lg border border-slate-200 p-4">
				<div className="mb-2 flex items-center justify-between gap-3">
					<h3 className="font-semibold text-slate-700">Source resource</h3>
					{content?.contentType && (
						<span className="text-xs uppercase text-slate-400">{content.contentType}</span>
					)}
				</div>
				{content?.text ? (
					<div className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
						{content.text}
					</div>
				) : isSafeSourceUrl ? (
					<a href={sourceUrl} target="_blank" rel="noreferrer" className="break-all text-sm text-blue-700 underline">
						{content?.originalFileName || sourceUrl}
					</a>
				) : (
					<p className="text-sm text-slate-500">{content?.originalFileName || "No source resource available"}</p>
				)}
			</section>

			{summary?.summary && (
				<section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
					<h3 className="mb-2 font-semibold text-slate-700">Summary</h3>
					<p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{summary.summary}</p>
				</section>
			)}

			{Array.isArray(summary?.keyPoints) && summary.keyPoints.length > 0 && (
				<section className="rounded-lg border border-slate-200 p-4 text-slate-700">
					<h3 className="mb-2 font-semibold">Key points</h3>
					<ul className="list-disc space-y-1 pl-5 text-sm">
						{summary.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
					</ul>
				</section>
			)}

			{summary?.keywords && (
				<section className="rounded-lg border border-slate-200 p-4">
					<h3 className="mb-2 font-semibold text-slate-700">Keywords</h3>
					<div className="flex flex-wrap gap-2">
						{(Array.isArray(summary.keywords) ? summary.keywords : [summary.keywords]).map((keyword, index) => (
							<span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">{keyword}</span>
						))}
					</div>
				</section>
			)}
		</div>
	)
}

export default HistoryContent