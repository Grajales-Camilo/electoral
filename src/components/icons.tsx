import React from 'react';

export const TutorIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-8 w-8 text-brand-blue-500" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
    />
  </svg>
);

export const DashboardIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-8 w-8 text-brand-blue-500" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m1.085 1.085V18m-7.5-3.75h7.5" 
    />
  </svg>
);

export const AnalysisIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-8 w-8 text-brand-blue-500" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M8 7v10m8-10v10" />
  </svg>
);

export const ReloadIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M4 4v5h5m-5-5a9 9 0 0115.55 5.55m-4.444 8.889v-5h-5m5 5a9 9 0 01-15.55-5.55" 
    />
  </svg>
);

export const SpinnerIcon: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 text-slate-700"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const WhatsAppIcon: React.FC = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.213 4.439 4.572-1.212zM9.06 8.519c-.359-.041-.775-.041-1.191-.043-.463 0-1.093.17-1.574.604-.49.44-.783 1.05-.921 1.269-.139.219-.281.438-.281.633 0 .195.143.438.421.748.275.31.57.64.91.99.417.43.83.84 1.317 1.231.694.55 1.343 1.001 2.168 1.27.971.324 1.742.296 2.301.12.584-.18 1.032-.691 1.236-1.33.195-.62.195-1.14.139-1.269-.056-.129-.204-.195-.421-.31-.217-.115-.463-.18-.942-.34-.479-.16-.838-.215-1.191-.34-.353-.125-.609-.18-.865-.041-.256.139-.395.34-.534.463-.139.125-.281.205-.42.205-.138.005-.281-.015-.42-.08-.139-.065-.281-.129-.534-.269-.254-.141-.534-.31-.865-.534-.33-.225-.634-.5-1.002-.83-.368-.33-.679-.701-.866-1.031-.186-.33-.28-.68-.28-.943s.093-.509.139-.62c.046-.115.138-.215.281-.31s.281-.14.42-.165c.138-.025.281-.025.42 0 .138.025.281.04.395.065.115.025.23.04.345.065.115.025.209.025.324 0 .114-.025.209-.09.281-.205.071-.115.114-.255.114-.42c0-.16-.046-.28-.114-.38-.069-.09-.161-.16-.281-.205-.12-.045-.316-.09-.584-.115-.268-.025-.561-.025-.838-.025z"/>
    </svg>
);