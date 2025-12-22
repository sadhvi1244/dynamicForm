import { useState } from "react";
import ModelPage from "./components/ModelPage";
import JsonEditorModal from "./components/JsonEditorModel";
import { recordConfig } from "./config/recordConfig";

const App = () => {
  const [currentModule, setCurrentModule] = useState("users");
  const [config, setConfig] = useState(recordConfig);
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  const modules = Object.keys(config.modules);
  const moduleConfig = config.modules[currentModule];

  const handleConfigUpdate = (newConfig) => {
    setConfig(newConfig);

    if (!newConfig.modules[currentModule]) {
      const firstModule = Object.keys(newConfig.modules)[0];
      if (firstModule) setCurrentModule(firstModule);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center py-4">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-blue-600 tracking-tight">
              ⚡ Admin Dashboard
            </h1>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                onClick={() => setShowJsonEditor(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium
                           hover:bg-purple-700 transition shadow-sm"
              >
                ⚙️ Edit Schema
              </button>

              {/* Module Tabs */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {modules.map((module) => {
                  const active = currentModule === module;
                  return (
                    <button
                      key={module}
                      onClick={() => setCurrentModule(module)}
                      className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition
                        ${
                          active
                            ? "bg-blue-600 text-white shadow"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      {config.modules[module].frontend.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {moduleConfig ? (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <ModelPage key={currentModule} moduleConfig={moduleConfig} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
            🚫 No modules available
            <br />
            <span className="text-sm">
              Click <b>Edit Schema</b> to add modules
            </span>
          </div>
        )}
      </main>

      {/* JSON EDITOR MODAL */}
      <JsonEditorModal
        isOpen={showJsonEditor}
        onClose={() => setShowJsonEditor(false)}
        currentConfig={config}
        onUpdate={handleConfigUpdate}
      />
    </div>
  );
};

export default App;
