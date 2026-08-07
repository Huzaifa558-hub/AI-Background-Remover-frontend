
interface DownloadButtonProps {
  downloadUrl: string
  filename?: string
}

export default function DownloadButton({ downloadUrl, filename = 'result.png' }: DownloadButtonProps) {
  return (
    <a
      href={downloadUrl}
      download={filename}
      className="
        inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-sm
        bg-teal hover:bg-teal-hover text-white
        shadow-sm hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:shadow-focus
        active:scale-95
      "
      aria-label={`Download ${filename}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
      </svg>
      Download PNG
    </a>
  )
}
