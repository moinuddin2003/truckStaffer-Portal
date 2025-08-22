"use client"

const PRIMARY_COLOR = "#F0831C"

const FileViewer = ({ files, onRemove, label, multiple = false }) => {
  const handleView = (file, index) => {
    if (file instanceof File) {
      // For newly uploaded files, create object URL
      const url = URL.createObjectURL(file)
      window.open(url, "_blank")
      // Clean up the object URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } else if (typeof file === "string") {
      // For files from backend (URLs)
      window.open(file, "_blank")
    }
  }

  const handleDownload = (file, index) => {
    if (file instanceof File) {
      // For newly uploaded files
      const url = URL.createObjectURL(file)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (typeof file === "string") {
      // For files from backend (URLs)
      const a = document.createElement("a")
      a.href = file
      a.download = `${label}_${index + 1}`
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const getFileName = (file, index) => {
    if (file instanceof File) {
      return file.name
    } else if (typeof file === "string") {
      // Extract filename from URL or use generic name
      const urlParts = file.split("/")
      return urlParts[urlParts.length - 1] || `${label}_${index + 1}`
    }
    return `File_${index + 1}`
  }

  const getFileSize = (file) => {
    if (file instanceof File) {
      const size = file.size
      if (size < 1024) return `${size} B`
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
      return `${(size / (1024 * 1024)).toFixed(1)} MB`
    }
    return ""
  }

  const isImage = (file) => {
    if (file instanceof File) {
      return file.type.startsWith("image/")
    } else if (typeof file === "string") {
      return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)
    }
    return false
  }

  if (!files || (Array.isArray(files) && files.length === 0) || (!Array.isArray(files) && !files)) {
    return null
  }

  const fileArray = Array.isArray(files) ? files : [files]

  return (
    <div className="mt-2">
      <label className="form-label text-sm text-success">📎 Uploaded {label}:</label>
      <div className="d-flex flex-column gap-2">
        {fileArray.map((file, index) => (
          <div
            key={index}
            className="d-flex align-items-center justify-content-between p-2 border rounded"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="d-flex align-items-center gap-2 flex-grow-1">
              <div
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: PRIMARY_COLOR + "20",
                  color: PRIMARY_COLOR,
                }}
              >
                {isImage(file) ? "🖼️" : "📄"}
              </div>
              <div className="flex-grow-1">
                <div className="text-sm fw-medium text-truncate" style={{ maxWidth: "200px" }}>
                  {getFileName(file, index)}
                </div>
                {getFileSize(file) && <div className="text-xs text-muted">{getFileSize(file)}</div>}
              </div>
            </div>

            <div className="d-flex gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                style={{
                  borderColor: PRIMARY_COLOR,
                  color: PRIMARY_COLOR,
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
                onClick={() => handleView(file, index)}
                title="View file"
              >
                👁️ View
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
                onClick={() => handleDownload(file, index)}
                title="Download file"
              >
                ⬇️ Download
              </button>
              {onRemove && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                  }}
                  onClick={() => onRemove(index)}
                  title="Remove file"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileViewer
