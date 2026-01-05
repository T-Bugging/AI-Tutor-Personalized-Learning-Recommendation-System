export default function ThemeToggle() {
  const toggle = () => document.body.classList.toggle("light");

  return (
    <button className="theme-toggle" onClick={toggle}>
      🌙 / ☀️
    </button>
  );
}
