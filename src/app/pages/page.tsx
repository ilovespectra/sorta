"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const exampleCommand = `ts-node src/app/pages/api/sorta.ts /path/to/source /path/to/destination`;
  const exampleCommandResume = `ts-node src/app/pages/api/sorta.ts --resume`;
  const exampleCommandByName = `ts-node src/app/pages/api/sorta-by-name.ts /path/to/source /path/to/destination/screenshots`;
  const exampleCreateMetaData = `ts-node src/app/pages/api/create-metadata.ts /path/to/source`;
  const exampleSortaPics = `ts-node src/app/pages/api/sorta-pics.ts /path/to/source /path/to/destination`;
  const diskUtil = `diskutil list`;
  
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Command copied to clipboard!");
    } catch (error) {
      alert("Failed to copy command. Please try again.");
      console.error(error);
    }
  };

  const styles = {
    container: {
      backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
      minHeight: "100vh",
      padding: "20px",
      transition: "all 0.3s ease",
    },
    themeToggle: {
      position: "fixed" as const,
      top: "20px",
      right: "20px",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
      border: `2px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.7)" : "rgba(255, 100, 0, 0.8)"}`,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      zIndex: 1000,
      transition: "all 0.3s ease",
      boxShadow: theme === "dark" 
        ? "0 4px 15px rgba(255, 140, 0, 0.2)" 
        : "0 4px 15px rgba(255, 100, 0, 0.3)",
    },
    hero: {
      textAlign: "center" as const,
      marginBottom: "60px",
      animation: "fadeIn 0.6s ease-out",
    },
    title: {
      fontSize: "3.5rem",
      fontWeight: 700,
      background: theme === "dark"
        ? "linear-gradient(135deg, rgba(255, 140, 0, 0.9), rgba(50, 205, 50, 0.9))"
        : "linear-gradient(135deg, rgba(255, 100, 0, 1), rgba(34, 139, 34, 1))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "16px",
    },
    subtitle: {
      fontSize: "1.3rem",
      color: theme === "dark" ? "#b0b0b0" : "#4a4a4a",
      fontWeight: 400,
    },
    card: {
      backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
      border: `1px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.3)" : "rgba(255, 100, 0, 0.4)"}`,
      borderRadius: "12px",
      padding: "32px",
      marginBottom: "24px",
      boxShadow: theme === "dark"
        ? "0 4px 20px rgba(255, 140, 0, 0.2)"
        : "0 4px 20px rgba(255, 100, 0, 0.3)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      maxWidth: "1000px",
      margin: "0 auto 24px auto",
    },
    sectionTitle: {
      fontSize: "2rem",
      color: theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)",
      marginBottom: "20px",
      fontWeight: 700,
    },
    subsectionTitle: {
      fontSize: "1.5rem",
      color: theme === "dark" ? "rgba(255, 140, 0, 0.8)" : "rgba(255, 100, 0, 0.9)",
      marginBottom: "15px",
      marginTop: "24px",
      fontWeight: 600,
    },
    scriptBox: {
      backgroundColor: theme === "dark" ? "#0a0a0a" : "#f8f8f8",
      border: `1px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.3)" : "rgba(255, 100, 0, 0.4)"}`,
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
    },
    successBox: {
      backgroundColor: theme === "dark" ? "rgba(50, 205, 50, 0.1)" : "rgba(34, 139, 34, 0.1)",
      border: `2px solid ${theme === "dark" ? "rgba(50, 205, 50, 0.7)" : "rgba(34, 139, 34, 0.8)"}`,
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
    },
    warningBox: {
      backgroundColor: theme === "dark" ? "rgba(255, 140, 0, 0.1)" : "rgba(255, 100, 0, 0.1)",
      border: `2px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.7)" : "rgba(255, 100, 0, 0.8)"}`,
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "16px",
      borderLeft: `4px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)"}`,
    },
    codeBlock: {
      display: "flex",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#0a0a0a" : "#f0f0f0",
      padding: "12px",
      borderRadius: "8px",
      marginTop: "10px",
      border: `1px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.3)" : "rgba(255, 100, 0, 0.4)"}`,
      fontFamily: "monospace",
    },
    button: {
      padding: "10px 20px",
      marginLeft: "10px",
      backgroundColor: "transparent",
      color: theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)",
      border: `2px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.7)" : "rgba(255, 100, 0, 0.8)"}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "12px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      transition: "all 0.3s ease",
      whiteSpace: "nowrap" as const,
    },
    link: {
      color: theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)",
      textDecoration: "none",
      fontWeight: 600,
      transition: "color 0.2s ease",
    },
    divider: {
      height: "2px",
      background: theme === "dark"
        ? "linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.7), transparent)"
        : "linear-gradient(90deg, transparent, rgba(255, 100, 0, 0.8), transparent)",
      margin: "40px 0",
    },
  };

  return (
    <div style={styles.container}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        style={styles.themeToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1) rotate(15deg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center" }}>
          <Image 
            src="/sorta.png" 
            alt="Sorta Logo" 
            width={200} 
            height={200}
            priority
            style={{ borderRadius: "12px" }}
          />
        </div>
        <h1 style={styles.title}>Sorta</h1>
        <p style={styles.subtitle}>Smart Terminal-Based File Organizer</p>
      </div>

      {/* Description Section */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>What Does Sorta Do?</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "20px" }}>
          <strong>Sorta</strong> is a powerful, terminal-based file organization tool that automatically 
          sorts and manages your files by type, date, and content. It features intelligent duplicate 
          detection using SHA-256 hashing and can organize thousands of files in minutes.
        </p>
        
        <h3 style={styles.subsectionTitle}>✨ Key Features</h3>
        <ul style={{ paddingLeft: "20px", lineHeight: "2", marginBottom: "20px" }}>
          <li>📊 <strong>Smart Organization</strong> - Sorts files by type, extension, and creation date</li>
          <li>🔍 <strong>Duplicate Detection</strong> - SHA-256 hash comparison saves storage space</li>
          <li>📅 <strong>Date Renaming</strong> - Files renamed with YYYY-MM-DD prefixes</li>
          <li>🚀 <strong>Fast Processing</strong> - Handles thousands of files with concurrent processing</li>
          <li>� <strong>Resume Capability</strong> - Interrupt and resume without duplicates or data loss</li>
          <li>📝 <strong>Comprehensive Logging</strong> - Color-coded console output and persistent log files</li>
          <li>�📁 <strong>130+ File Types</strong> - Images, videos, audio, documents, archives, and more</li>
          <li>📈 <strong>Progress Tracking</strong> - Real-time progress with ETA and detailed statistics</li>
        </ul>

        <div style={styles.successBox}>
          <h3 style={{ ...styles.subsectionTitle, color: theme === "dark" ? "rgba(50, 205, 50, 0.9)" : "rgba(34, 139, 34, 1)" }}>
            🔒 Your Security & Privacy
          </h3>
          <ul style={{ paddingLeft: "20px", lineHeight: "2", marginBottom: 0 }}>
            <li>✅ Operates <strong>100% locally</strong> on your machine - no cloud, no uploads</li>
            <li>✅ No backend APIs or external servers involved</li>
            <li>✅ Only accesses the folders you explicitly specify</li>
            <li>✅ Your data stays private and under your complete control</li>
          </ul>
        </div>
      </div>

      <div style={styles.divider}></div>

      {/* GitHub Button */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <a
          href="https://github.com/ilovespectra/sorta"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            color: theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)",
            textDecoration: "none",
            padding: "14px 28px",
            borderRadius: "8px",
            border: `2px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.7)" : "rgba(255, 100, 0, 0.8)"}`,
            fontWeight: 600,
            fontSize: "16px",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
            e.currentTarget.style.color = theme === "dark" ? "#000000" : "#ffffff";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = theme === "dark"
              ? "0 4px 15px rgba(255, 140, 0, 0.4)"
              : "0 4px 15px rgba(255, 100, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span style={{ marginRight: "10px", fontSize: "20px" }}>⭐</span>
          View on GitHub
        </a>
      </div>

      {/* Available Scripts Overview */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📚 Available Scripts</h2>
        <p style={{ marginBottom: "20px", lineHeight: "1.8" }}>
          Sorta provides specialized scripts for different file types and organization needs:
        </p>
        
        <div style={{ ...styles.scriptBox, border: `2px solid ${theme === "dark" ? "rgba(50, 205, 50, 0.7)" : "rgba(34, 139, 34, 0.8)"}` }}>
          <h4 style={{ ...styles.subsectionTitle, fontSize: "1.2rem", marginTop: 0, color: theme === "dark" ? "rgba(50, 205, 50, 0.9)" : "rgba(34, 139, 34, 1)" }}>
            ⭐ sorta.ts v2.0 <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>(NEW - Auto-Metadata + Resume)</span>
          </h4>
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>✅ Automatically creates and validates metadata</li>
            <li>✅ Organizes all files by extension</li>
            <li>✅ Resume capability after interruption</li>
            <li>✅ Enhanced progress tracking with ETA</li>
            <li>✅ Comprehensive logging and error handling</li>
          </ul>
          <div style={styles.successBox}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              ✨ <strong>One command</strong> does everything! Files are <strong>COPIED</strong> (originals remain).
            </p>
          </div>
        </div>
        
        <div style={styles.scriptBox}>
          <h4 style={{ ...styles.subsectionTitle, fontSize: "1.2rem", marginTop: 0 }}>
            🎯 Specialized Organizers <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>(Require Metadata)</span>
          </h4>
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li><code>sorta-pics.ts</code> - Images (50+ formats: jpg, png, heic, raw, etc.)</li>
            <li><code>sorta-vids.ts</code> - Videos (30+ formats: mp4, mov, avi, mkv, etc.)</li>
            <li><code>sorta-audio.ts</code> - Audio (mp3, wav, flac, aac, etc.)</li>
            <li><code>sorta-else.ts</code> - Documents, archives, scripts, fonts</li>
          </ul>
          <div style={styles.warningBox}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              ⚠️ These scripts <strong>MOVE</strong> files (originals removed) and require metadata creation first!
            </p>
          </div>
        </div>

        <div style={styles.scriptBox}>
          <h4 style={{ ...styles.subsectionTitle, fontSize: "1.2rem", marginTop: 0 }}>
            ⚡ Quick Organizers <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>(No Metadata)</span>
          </h4>
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li><code>sorta-by-name.ts</code> - Find files by name (e.g., &quot;Screenshot&quot;)</li>
          </ul>
        </div>

        <div style={styles.scriptBox}>
          <h4 style={{ ...styles.subsectionTitle, fontSize: "1.2rem", marginTop: 0 }}>
            🔧 Utility Scripts
          </h4>
          <ul style={{ paddingLeft: "20px", lineHeight: "2", marginBottom: 0 }}>
            <li><code>create-metadata.ts</code> - Creates SHA-256 hashes (auto-run by sorta.ts)</li>
            <li><code>inspect.ts</code> - Debug file metadata and timestamps</li>
            <li><code>delete-duplicates.ts</code> - Remove duplicate files</li>
          </ul>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>🚀 Quick Start Guide</h2>
        <ol style={{ fontSize: "1.05rem", lineHeight: "2", paddingLeft: "24px" }}>
          <li style={{ marginBottom: "20px" }}>
            <strong>Install Node.js and npm:</strong><br />
            If you don&apos;t have Node.js installed, download it from the{" "}
            <a
              href="https://nodejs.org"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              official website
            </a>
            . Ensure npm is included.
          </li>

          <li style={{ marginBottom: "20px" }}>
            <strong>Clone the Repository:</strong><br />
            <div style={{
              ...styles.codeBlock,
              flexDirection: "column",
              alignItems: "flex-start",
              fontFamily: "monospace",
              fontSize: "0.95rem"
            }}>
              <div>git clone https://github.com/ilovespectra/sorta.git</div>
              <div>cd sorta</div>
              <div>npm install</div>
            </div>
          </li>

          <li style={{ marginBottom: "20px" }}>
            <strong>Locate Your Drives:</strong><br />
            Connect any external drives you want to organize. Use this command to find their paths:
            <div style={styles.codeBlock}>
              <code style={{ flex: 1 }}>{diskUtil}</code>
              <button
                style={styles.button}
                onClick={() => handleCopy(diskUtil)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
                  e.currentTarget.style.color = theme === "dark" ? "#000000" : "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
                }}
              >
                Copy
              </button>
            </div>
            <p style={{ marginTop: "10px", fontSize: "0.95rem" }}>
              Identify paths like <code style={{
                backgroundColor: theme === "dark" ? "#0a0a0a" : "#f0f0f0",
                padding: "2px 8px",
                borderRadius: "4px",
                border: `1px solid ${theme === "dark" ? "rgba(255, 140, 0, 0.3)" : "rgba(255, 100, 0, 0.4)"}`
              }}>/Volumes/YourDriveName</code>
            </p>
          </li>
        </ol>
      </div>

      <div style={styles.divider}></div>

      {/* Common Use Cases */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>💡 Common Use Cases</h2>
        
        {/* Use Case 1: sorta.ts v2.0 */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ ...styles.subsectionTitle, color: theme === "dark" ? "rgba(50, 205, 50, 0.9)" : "rgba(34, 139, 34, 1)" }}>
            ⭐ 1️⃣ Quick Organize Everything (sorta.ts v2.0)
          </h3>
          <p style={{ marginBottom: "15px", lineHeight: "1.8" }}>
            <strong>What it does:</strong> One command to organize all files by extension. 
            Automatically creates metadata, validates file counts, detects duplicates by hash, 
            and can resume if interrupted. Files are <strong>COPIED</strong> (originals remain).
          </p>
          
          <p style={{ fontWeight: 600, marginTop: "20px", marginBottom: "10px" }}>Start Organization:</p>
          <div style={styles.codeBlock}>
            <code style={{ flex: 1, fontSize: "0.9rem" }}>{exampleCommand}</code>
            <button
              style={styles.button}
              onClick={() => handleCopy(exampleCommand)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
                e.currentTarget.style.color = theme === "dark" ? "#000000" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
              }}
            >
              Copy
            </button>
          </div>

          <p style={{ fontWeight: 600, marginTop: "20px", marginBottom: "10px" }}>Resume After Interruption:</p>
          <div style={styles.codeBlock}>
            <code style={{ flex: 1, fontSize: "0.9rem" }}>{exampleCommandResume}</code>
            <button
              style={styles.button}
              onClick={() => handleCopy(exampleCommandResume)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
                e.currentTarget.style.color = theme === "dark" ? "#000000" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
              }}
            >
              Copy
            </button>
          </div>
          <div style={styles.successBox}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              ✅ Files will be <strong>COPIED</strong> (originals remain) • Resume capability • Auto-metadata
            </p>
          </div>
        </div>
        
        {/* Use Case 2: Metadata-based */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={styles.subsectionTitle}>2️⃣ Organize Photos with Date Renaming (Traditional Method)</h3>
          <p style={{ marginBottom: "15px", lineHeight: "1.8" }}>
            <strong>What it does:</strong> Organizes images by creation date, detects duplicates by hash, 
            renames with dates (YYYY-MM-DD format), and <strong>moves</strong> files to organized folders.
          </p>
          
          <p style={{ fontWeight: 600, marginTop: "20px", marginBottom: "10px" }}>Step 1: Create Metadata</p>
          <div style={styles.codeBlock}>
            <code style={{ flex: 1, fontSize: "0.9rem" }}>{exampleCreateMetaData}</code>
            <button
              style={styles.button}
              onClick={() => handleCopy(exampleCreateMetaData)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
                e.currentTarget.style.color = theme === "dark" ? "#000000" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
              }}
            >
              Copy
            </button>
          </div>

          <p style={{ fontWeight: 600, marginTop: "20px", marginBottom: "10px" }}>Step 2: Organize Images</p>
          <div style={styles.codeBlock}>
            <code style={{ flex: 1, fontSize: "0.9rem" }}>{exampleSortaPics}</code>
            <button
              style={styles.button}
              onClick={() => handleCopy(exampleSortaPics)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
                e.currentTarget.style.color = theme === "dark" ? "#000000" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
              }}
            >
              Copy
            </button>
          </div>
          <div style={styles.warningBox}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              ⚠️ Files will be <strong>MOVED</strong> (removed from source)
            </p>
          </div>
        </div>

        {/* Use Case 3: Quick sort */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={styles.subsectionTitle}>3️⃣ Find All Screenshots</h3>
          <p style={{ marginBottom: "15px", lineHeight: "1.8" }}>
            <strong>What it does:</strong> Finds all files with &quot;screenshot&quot; in the filename 
            and moves them to a screenshots folder. No metadata needed.
          </p>
          <div style={styles.codeBlock}>
            <code style={{ flex: 1, fontSize: "0.9rem" }}>{exampleCommandByName}</code>
            <button
              style={styles.button}
              onClick={() => handleCopy(exampleCommandByName)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
                e.currentTarget.style.color = theme === "dark" ? "#000000" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = theme === "dark" ? "rgba(255, 140, 0, 0.9)" : "rgba(255, 100, 0, 1)";
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div style={styles.divider}></div>

      {/* Important Warnings */}
      <div style={{
        ...styles.card,
        backgroundColor: theme === "dark" ? "rgba(139, 0, 0, 0.1)" : "rgba(255, 69, 0, 0.1)",
        border: `2px solid ${theme === "dark" ? "rgba(255, 69, 0, 0.7)" : "rgba(255, 69, 0, 0.9)"}`,
        borderLeft: `4px solid ${theme === "dark" ? "rgba(255, 69, 0, 0.9)" : "rgba(255, 69, 0, 1)"}`,
      }}>
        <h2 style={{ ...styles.sectionTitle, color: theme === "dark" ? "rgba(255, 69, 0, 0.9)" : "rgba(255, 69, 0, 1)", marginTop: 0 }}>
          ⚠️ Important Warnings
        </h2>
        <ul style={{ paddingLeft: "20px", lineHeight: "2", margin: 0 }}>
          <li><strong>BACKUP YOUR DATA FIRST</strong> - Some scripts MOVE files (not copy)</li>
          <li><strong>TEST on a small folder</strong> before running on important data</li>
          <li><strong>sorta.ts v2.0</strong>: Auto-creates metadata, COPIES files, has resume capability</li>
          <li><strong>Traditional scripts</strong>: Require create-metadata.ts first, MOVE files</li>
          <li><strong>Scripts that MOVE</strong>: sorta-pics, sorta-vids, sorta-audio, sorta-else, sorta-by-name</li>
          <li><strong>Scripts that COPY</strong>: sorta.ts v2.0 only</li>
        </ul>
      </div>

      <div style={styles.divider}></div>

      {/* Documentation Links */}
      <div style={{
        ...styles.card,
        border: `2px solid ${theme === "dark" ? "rgba(50, 205, 50, 0.7)" : "rgba(34, 139, 34, 0.8)"}`,
        backgroundColor: theme === "dark" ? "rgba(50, 205, 50, 0.05)" : "rgba(34, 139, 34, 0.05)",
      }}>
        <h2 style={{ ...styles.sectionTitle, color: theme === "dark" ? "rgba(50, 205, 50, 0.9)" : "rgba(34, 139, 34, 1)", marginTop: 0 }}>
          📖 Complete Documentation
        </h2>
        <p style={{ marginBottom: "20px", lineHeight: "1.8" }}>
          For detailed instructions, workflows, and examples:
        </p>
        <ul style={{ paddingLeft: "20px", lineHeight: "2.2", fontSize: "1.05rem", marginBottom: 0 }}>
          <li>
            <a href="https://github.com/ilovespectra/sorta/blob/main/SORTA_V2_FEATURES.md" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{ ...styles.link, fontWeight: 700 }}>
              ⭐ SORTA_V2_FEATURES.md
            </a> - Complete v2.0 guide with resume, logging, and troubleshooting
          </li>
          <li>
            <a href="https://github.com/ilovespectra/sorta/blob/main/QUICK_REFERENCE.md" 
               target="_blank" 
               rel="noopener noreferrer"
               style={styles.link}>
              📋 QUICK_REFERENCE.md
            </a> - Fast lookup guide
          </li>
          <li>
            <a href="https://github.com/ilovespectra/sorta/blob/main/ARCHITECTURE.md" 
               target="_blank" 
               rel="noopener noreferrer"
               style={styles.link}>
              🏗️ ARCHITECTURE.md
            </a> - Visual workflows & diagrams
          </li>
          <li>
            <a href="https://github.com/ilovespectra/sorta/blob/main/REFERENCE.sh" 
               target="_blank" 
               rel="noopener noreferrer"
               style={styles.link}>
              🔧 REFERENCE.sh
            </a> - Complete command reference
          </li>
          <li>
            <a href="https://github.com/ilovespectra/sorta/tree/main/examples" 
               target="_blank" 
               rel="noopener noreferrer"
               style={styles.link}>
              📂 examples/
            </a> - Ready-to-use bash scripts
          </li>
        </ul>
      </div>

    </div>
  );
}
