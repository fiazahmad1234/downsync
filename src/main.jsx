
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import { createRoot } from "react-dom/client";

import {
  ArrowDownToLine,
  CheckCircle2,
  Clock3,
  Download,
  Film,
  LoaderCircle,
  Play,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import "./index.css";

const API = "/api";

function bytes(n) {
  if (!n) return "—";

  if (n < 1048576) {
    return Math.round(n / 1024) + " KB";
  }

  return (n / 1048576).toFixed(1) + " MB";
}

function hasVideo(format) {
  return format && format.vcodec && format.vcodec !== "none";
}

function hasAudio(format) {
  return format && format.acodec && format.acodec !== "none";
}

function App() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [format, setFormat] = useState("");
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  // Prevent automatic download from firing more than once
  const autoDownloaded = useRef(false);

  const formats = useMemo(() => {
    if (!info || !info.formats) return [];

    const seen = new Set();

    return info.formats
      .filter((f) => hasVideo(f) && f.height)
      .sort(
        (a, b) =>
          (b.height || 0) - (a.height || 0) ||
          (b.fps || 0) - (a.fps || 0)
      )
      .filter((f) => {
        const key =
          (f.height || "") +
          "-" +
          (f.fps || "") +
          "-" +
          (f.ext || "") +
          "-" +
          hasAudio(f);

        if (seen.has(key)) return false;

        seen.add(key);

        return true;
      })
      .slice(0, 12);
  }, [info]);

  /*
   * FILE URL
   */
  const getFileUrl = (token) => {
    return API + "/downloads/" + token + "/file";
  };

  /*
   * AUTOMATIC FILE DOWNLOAD
   */
  const downloadFile = async (token) => {
    if (!token) return;

    try {
      const response = await fetch(getFileUrl(token), {
        headers: {
          Accept: "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error("Could not download the completed file.");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = "downsync-video.mp4";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Automatic download failed:", err);

      setError(
        err.message || "File is ready, but automatic download failed."
      );
    }
  };

  /*
   * LIVE JOB STATUS
   *
   * Progress system is kept exactly as before.
   */
  useEffect(() => {
    if (!job || !job.token) return;

    /*
     * DOWNLOAD AUTOMATICALLY WHEN READY
     */
    if (job.status === "ready") {
      if (!autoDownloaded.current) {
        autoDownloaded.current = true;

        downloadFile(job.token);
      }

      return;
    }

    /*
     * STOP POLLING ON FAILURE
     */
    if (job.status === "failed") {
      return;
    }

    /*
     * POLL SERVER
     */
    const timer = setInterval(async () => {
      try {
        const response = await fetch(
          API + "/downloads/" + job.token,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setJob(data);
      } catch (err) {
        console.error("Status check failed:", err);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [job]);

  /*
   * INSPECT VIDEO
   */
  const inspect = async () => {
    setError("");
    setInfo(null);
    setJob(null);
    setFormat("");

    autoDownloaded.current = false;

    if (!url.trim()) {
      setError("Please enter a video URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API + "/inspect", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Laravel returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Could not inspect this URL."
        );
      }

      setInfo(data);

      if (data.formats && data.formats.length) {
        const videoFormats = data.formats
          .filter(
            (item) =>
              hasVideo(item) &&
              item.height
          )
          .sort(
            (a, b) =>
              (b.height || 0) -
              (a.height || 0)
          );

        if (videoFormats.length) {
          setFormat(
            videoFormats[0].format_id
          );
        }
      }
    } catch (err) {
      console.error("Inspect error:", err);

      setError(
        err.message ||
          "Could not inspect this URL."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * START DOWNLOAD
   */
  const start = async () => {
    setError("");

    autoDownloaded.current = false;

    if (!info) {
      setError(
        "Please inspect a video first."
      );

      return;
    }

    if (!format) {
      setError(
        "Please select a format."
      );

      return;
    }

    setLoading(true);

    try {
      let selectedFormat = null;

      if (info.formats) {
        selectedFormat =
          info.formats.find(
            (item) =>
              item.format_id === format
          );
      }

      const response = await fetch(
        API + "/downloads",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            url: url.trim(),

            format_id: format,

            format_label:
              selectedFormat
                ? selectedFormat.height
                  ? selectedFormat.height +
                    "p"
                  : selectedFormat.format_id
                : format,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Laravel returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Could not start download."
        );
      }

      /*
       * Laravel can return:
       *
       * { download: {...} }
       *
       * OR
       *
       * {...}
       */
      const newJob =
        data.download || data;

      setJob(newJob);
    } catch (err) {
      console.error(
        "Download error:",
        err
      );

      setError(
        err.message ||
          "Could not start download."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      {/* HEADER */}
      <header>
        <div className="brand">
          <b>
            <ArrowDownToLine size={18} />
          </b>

          downsync
        </div>

        <div className="pill">
          <ShieldCheck size={14} />

          Fast · Private · Simple
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="hero">

          <div className="eyebrow">
            <Sparkles size={13} />

            ALL-IN-ONE VIDEO DOWNLOADER
          </div>

          <h1>
            Paste. Pick quality.
            <br />

            <em>Download.</em>
          </h1>

          <p>
            Detect available video formats
            and save the quality you need
            with a fast, clean workflow.
          </p>

          <div className="search">

            <div className="input">

              <Film size={19} />

              <input
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    inspect();
                  }
                }}
                placeholder="Paste a video URL here..."
              />

              <button
                disabled={
                  !url.trim() ||
                  loading
                }
                onClick={inspect}
              >

                {loading ? (
                  <LoaderCircle className="spin" />
                ) : (
                  <Play size={16} />
                )}

                {loading
                  ? "Checking"
                  : "Get video"}

              </button>

            </div>

            <small>
              Use public video URLs that
              you have permission to download.
            </small>

          </div>

        </section>

        {/* ERROR */}
        {error && (
          <div className="alert">

            <XCircle size={18} />

            {error}

          </div>
        )}

        {/* VIDEO INFO */}
        {info && (
          <section className="card result">

            <div className="thumb">

              {info.thumbnail ? (
                <img
                  src={info.thumbnail}
                  alt=""
                />
              ) : (
                <Film size={36} />
              )}

            </div>

            <div>

              <label>
                READY TO DOWNLOAD
              </label>

              <h2>
                {info.title ||
                  "Video"}
              </h2>

              <p className="sub">

                {info.uploader ||
                  "Video"}

                {info.duration
                  ? " · " +
                    Math.round(
                      info.duration / 60
                    ) +
                    " min"
                  : ""}

              </p>

              <div className="formats">

                {formats.map((f) => (

                  <button
                    key={f.format_id}
                    onClick={() =>
                      setFormat(
                        f.format_id
                      )
                    }
                    className={
                      format ===
                      f.format_id
                        ? "fmt active"
                        : "fmt"
                    }
                  >

                    <b>
                      {f.height
                        ? f.height +
                          "p"
                        : "Video"}
                    </b>

                    <span>

                      {f.ext
                        ? f.ext.toUpperCase()
                        : ""}

                      {f.filesize
                        ? " · " +
                          bytes(
                            f.filesize
                          )
                        : f.filesize_approx
                        ? " · " +
                          bytes(
                            f.filesize_approx
                          )
                        : ""}

                    </span>

                  </button>

                ))}

              </div>

              {/* DOWNLOAD BUTTON */}
              <button
                className="download"
                disabled={
                  !format ||
                  loading ||
                  (job &&
                    job.status !==
                      "ready" &&
                    job.status !==
                      "failed")
                }
                onClick={start}
              >

                {loading ? (
                  <LoaderCircle className="spin" />
                ) : (
                  <Download />
                )}

                Download HD

              </button>

            </div>

          </section>
        )}

        {/* PROGRESS BLOCK */}
        {job && (
          <section className="card progress">

            <div className="progressTop">

              <div>

                <label
                  className={
                    job.status
                  }
                >

                  {job.status ===
                  "ready"
                    ? "COMPLETE"
                    : job.status ===
                      "failed"
                    ? "FAILED"
                    : "DOWNLOADING"}

                </label>

                <h3>

                  {job.status ===
                  "ready"
                    ? "Your file is ready"

                    : job.status ===
                      "failed"
                    ? "Download failed"

                    : "Preparing your download..."}

                </h3>

              </div>

              {job.status ===
              "ready" ? (
                <CheckCircle2 />

              ) : job.status ===
                "failed" ? (
                <XCircle />

              ) : (
                <Clock3 />
              )}

            </div>

            {/* PROGRESS BAR */}
            <div className="bar">

              <i
                style={{
                  width:
                    `${Math.min(
                      Math.max(
                        job.progress ||
                          0,
                        0
                      ),
                      100
                    )}%`,

                  transition:
                    "width 0.4s ease-in-out",
                }}
              />

            </div>

            {/* PROGRESS INFO */}
            <div className="row">

              <span>
                {job.progress || 0}%
              </span>

              <span>
                {bytes(
                  job.file_size
                )}
              </span>

            </div>

            {/* AUTO DOWNLOAD MESSAGE */}
            {job.status ===
              "ready" && (
              <div className="download">

                <CheckCircle2 />

                Download completed
                automatically

              </div>
            )}

            {/* ERROR */}
            {job.error && (
              <pre>
                {job.error}
              </pre>
            )}

          </section>
        )}

        {/* FEATURES */}
        <section className="features">

          <article>

            <ShieldCheck />

            <h3>
              Safer by design
            </h3>

            <p>
              URL validation,
              throttling,
              private-network
              protection and
              temporary files.
            </p>

          </article>

          <article>

            <Sparkles />

            <h3>
              Real formats
            </h3>

            <p>
              Formats are detected
              from the source instead
              of guessed by Downsync.
            </p>

          </article>

          <article>

            <ArrowDownToLine />

            <h3>
              Fast pipeline
            </h3>

            <p>
              Retries, concurrent
              fragments and FFmpeg
              merging for HD sources.
            </p>

          </article>

        </section>

      </main>

      <footer>

        © {new Date().getFullYear()}
        {" "}Downsync · Download content
        you are authorized to save.

      </footer>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);

