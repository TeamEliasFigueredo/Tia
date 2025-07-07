import React from "react";

interface ProcessingOverlayProps {
  isProcessing: boolean;
  progress: number;
  processedDocuments: number;
  documentsToProcess: number;
}

export function ProcessingOverlay({
  isProcessing,
  progress,
  processedDocuments,
  documentsToProcess,
}: ProcessingOverlayProps) {
  if (!isProcessing) return null;

  return (
    <div className="processing-overlay">
      <div className="processing-modal">
        <div className="text-center">
          <div className="processing-spinner"></div>
          <h3 className="processing-title">Processing Documents</h3>
          <p className="processing-description">
            Please wait while we process your documents...
          </p>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="processing-status">
            {processedDocuments}/{documentsToProcess} documents ({progress}%
            complete)
          </p>
        </div>
      </div>
    </div>
  );
}
