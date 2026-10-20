export function getWelcomeMessage() {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 18) return "Good Afternoon";
  if (hour >= 18 && hour < 24) return "Good Night";
}
