const formatRuntime = (totalMinutes) => {
  if (!totalMinutes || typeof totalMinutes !== "number" || totalMinutes <= 0) {
    return "duração não disponível.";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursPart = hours > 0 ? `${hours}h` : "";
  const minutesPart = minutes > 0 ? `${minutes}m` : "";

  // Junta as partes, adicionando um espaço se ambas existirem
  return `${hoursPart}${hoursPart && minutesPart ? " " : ""}${minutesPart}`;
};

export default formatRuntime
