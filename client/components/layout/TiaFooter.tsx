import React, { memo } from "react";
import { Translations } from "@/lib/i18n";

interface TiaFooterProps {
  t: Translations;
}

const TiaFooter = memo<TiaFooterProps>(({ t }) => {
  return (
    <footer className="bg-gray-800 text-white py-2 px-6 border-t-4 border-blue-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-xs text-gray-300">
            <a
              href="https://softiabot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Tia
            </a>
            <span className="text-gray-400 text-xs ml-1">v2.1.0</span>
            &nbsp;is a Creation of&nbsp;
            <a
              href="https://softia.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t.softiaLink}
            </a>
          </p>
        </div>
        <div className="text-xs text-gray-400">
          © 2024 Softia.ca - {t.rightsReserved}
        </div>
      </div>
    </footer>
  );
});

TiaFooter.displayName = "TiaFooter";

export default TiaFooter;
