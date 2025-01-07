"use client";
import Image from "next/image";

export default function Home() {
  const exampleCommand = `npx --max-old-space-size=4096 ts-node --esm sorta.ts /path/to/source /path/to/destination`;
  const exampleCommandByName = `npx --max-old-space-size=4096 ts-node --esm sorta-by-name.ts /path/to/source /path/to/destination/screenshots`;
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Command copied to clipboard!");
    } catch (error) {
      alert("Failed to copy command. Please try again.");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Image
          src="/sorta.png"
          alt="Sorta Logo"
          width={150}
          height={150}
        />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Sorta: File Organizer
      </h1>

      {/* Description Section */}
      <div
  style={{
    backgroundColor: "#2d2d2d",
    padding: "15px",
    maxWidth: "80vh",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
    margin: "auto", // Center horizontally
    // display: "flex", // For vertical alignment
    justifyContent: "center",
    alignItems: "center"
  }}
>
        <h2 style={{ marginBottom: "10px" }}>What Does Sorta Do?</h2>
        <p>
          Sorta is a simple, secure, and efficient file organization script
          designed to help you tidy up your drives and folders. It scans the
          source folder you specify, along with all its subfolders, to organize
          files into your destination folder based on their types.
        </p>
        <p>
          <strong>Your Security Comes First:</strong>
        </p>
        <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
          <li>
            Sorta operates entirely locally on your machine. No files are
            uploaded, and no data is stored anywhere.
          </li>
          <li>There are no backend APIs or external servers involved.</li>
          <li>The script only accesses the folders and files you specify.</li>
        </ul>

        <p>
          With Sorta, you can confidently organize your files knowing your data
          stays private and under your control.
        </p>
      </div>
       {/* GitHub Button */}
       <div style={{ textAlign: "center", marginTop: "20px" }}>
        <a
          href="https://github.com/ilovespectra/sorta"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2d2d2d",
            color: "#f5f5f5",
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "2px solid #61dafb",
            fontWeight: "bold",
            fontSize: "16px",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#61dafb";
            e.currentTarget.style.color = "#1e1e1e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2d2d2d";
            e.currentTarget.style.color = "#f5f5f5";
          }}
        >
          <img
            src="/github-logo-white.png"
            alt="GitHub Logo"
            style={{
              width: "24px",
              height: "24px",
              marginRight: "10px",
            }}
          />
          View on GitHub
        </a>
      </div>
      {/* Walkthrough Section */}
      <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
        <h2>Step-by-Step Guide:</h2>
        <ol>
          <li>
            <strong>Install Node.js and npm:</strong> If you don’t have Node.js
            installed, download it from the{" "}
            <a
              href="https://nodejs.org"
              target="_blank"
              style={{ color: "#61dafb" }}
            >
              official website
            </a>
            . Ensure npm is included.
          </li>
          <li>
            <strong>Prepare Your Script:</strong> Make sure your
            `organizeByType.ts` script is located in a directory accessible by
            your terminal.
          </li>
          <li>
            <strong>Locate Your Drives:</strong> Connect the drives you want to
            organize. Use the command below to find their paths:
            <pre
              style={{
                backgroundColor: "#2d2d2d",
                padding: "10px",
                borderRadius: "5px",
                overflowX: "auto",
                marginTop: "10px",
                color: "#f8f8f2",
              }}
            >
              diskutil list
            </pre>
            Identify the paths, such as `/Volumes/YourDriveName`.
          </li>
          <li>
            <strong>Run the Command:</strong> Use the following command to
            execute the script:
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#2d2d2d",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "10px",
                color: "#f8f8f2",
              }}
            >
              <code style={{ flex: 1 }}>{exampleCommand}</code>
              <button
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#61dafb",
                  color: "#1e1e1e",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
                onClick={() => handleCopy(exampleCommand)}
              >
                Copy
              </button>
            </div>
          </li>
          <li>
            <strong>Verify the Results:</strong> Check the destination folder to
            ensure the files have been organized correctly.
          </li>
        </ol>

        <h2>Example Command:</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#2d2d2d",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
            color: "#f8f8f2",
          }}
        >
          <code style={{ flex: 1 }}>{exampleCommand}</code>
          <button
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#61dafb",
              color: "#1e1e1e",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            onClick={() => handleCopy(exampleCommand)}
          >
            Copy
          </button>
        </div>
        <h2>Sorta by Name</h2>
        <p>Additionally, you can use the sorta-by-name.ts script to organize by text present in file names, like &apos;Screenshot&apos; for example.</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#2d2d2d",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
            color: "#f8f8f2",
            marginBottom: "20px"
          }}
        >
          <code style={{ flex: 1 }}>{exampleCommandByName}</code>
          <button
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#61dafb",
              color: "#1e1e1e",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              marginBottom: "20px"
            }}
            onClick={() => handleCopy(exampleCommandByName)}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
