import React from 'react';

// --- Icono de Dashboard ---
export const DashboardIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
  </svg>
);

// --- Icono de Tutor/Voluntario ---
export const TutorIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6m6 3v4M21 12h-6"></path>
  </svg>
);

// --- Icono de Análisis ---
export const AnalysisIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
  </svg>
);

// --- Icono de Recargar ---
export const ReloadIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l16 16"></path>
  </svg>
);

// --- Icono de Spinner/Carga ---
export const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Icono de WhatsApp ---
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-5 h-5 mr-2"} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.505 1.905 6.344l-.24 1.103 1.133-.215zm-4.023 1.079l3.45-1.117c-1.166-1.956-1.808-4.043-1.807-6.15.003-5.006 4.072-9.074 9.075-9.074s9.072 4.068 9.072 9.074-4.069 9.074-9.074 9.074c-1.834-.001-3.65-.615-5.116-1.74l-3.57 1.161zm7.35-7.441c-.333-.167-.465-.248-1.012-.416-1.117-.351-1.742-.516-2.131-.416-.389.1-.516.416-.643.583-.127.166-.219.291-.385.416-.167.125-.333.167-.583.125-.333-.042-1.396-.5-2.617-1.625-1.633-1.417-2.731-3.229-3.031-3.792-.291-.583-.042-1.042.25-1.375.25-.292.5-.375.625-.5.125-.125.167-.208.25-.333.083-.125.042-.25 0-.416-.042-.167-.542-1.292-.75-1.792-.208-.5-.417-.416-.583-.416-.167 0-.333 0-.5 0-.167 0-.417.042-.667.25-.25.208-.917.833-1.083 2.083-.167 1.167.5 2.583 1.083 3.667.583 1.083 1.833 2.667 4.167 4.583 2.75 2.25 4.333 2.917 5.167 3.25.833.333 1.5.25 2.083.167.667-.125 1.417-.833 1.667-1.583.25-.75.25-1.417.167-1.583-.083-.167-.25-.25-.5-.417z"/>
    </svg>
);

// --- Icono de Correo ---
export const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-5 h-5 mr-2"} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 5.457v13.086c0 .845-.643 1.457-1.429 1.457H1.429C.643 20 0 19.388 0 18.543V5.457c0-1.192 1.357-1.797 2.286-1.02L12 11.25l9.714-6.813c.929-.777 2.286-.172 2.286 1.02zM1.429 3h21.143c.845 0 1.429.612 1.429 1.457v.388L12 11.25 0 4.845v-.388C0 3.612.643 3 1.429 3z"/>
    </svg>
);

// --- Icono de Cerrar (X) --- ¡NUEVO!
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);
