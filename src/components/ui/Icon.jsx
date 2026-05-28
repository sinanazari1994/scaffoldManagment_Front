const IC = {
  home: "M3 12l2-2v8h4v-4h4v4h4v-8l2-2M9 22v-8h6v8",
  folder: "M2 6h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z",
  box: "M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm2 0v-2h14v2",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M15 3a4 4 0 0 1 0 7M7 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
  chart: "M4 20h16M6 16V10M10 20V4M14 20v-6M18 20V8",
  plus: "M12 5v14M5 12h14",
  x: "M18 6L6 18M6 6l12 12",
  check: "M5 13l4 4L19 7",
  edit: "M9 20h6l7-7-6-6-7 7v6zM16 4l4 4",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-2 0h2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h2M10 10v6M14 10v6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.82 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.82.7A2 2 0 0 1 22 16.92z",
  loc: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0zM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  cal: "M8 2v3M16 2v3M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  transfer: "M13 7h4v4M17 7l-4 4M11 17H7v-4M7 17l4-4",
  invoice: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8",
  chevron: "M6 9l6 6 6-6",
  back: "M19 12H5M12 19l-7-7 7-7",
  warn: "M12 2L2 22h20L12 2zM12 18h.01M12 14v-4",
  task: "M9 13h6M9 17h6M5 9h2M5 13h2M5 17h2M17 5h2M17 9h2M17 13h2",
  hardhat: "M6 20v-3a6 6 0 0 1 12 0v3M6 17v-5a6 6 0 0 1 12 0v5M8 7V4a4 4 0 0 1 8 0v3",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
  search: "M11 17a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM21 21l-4.35-4.35",
  clock: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 6v6l4 2",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
};

export default function Icon({ name, size = 20, color = 'currentColor', w = 1.9 }) {
  const d = IC[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}