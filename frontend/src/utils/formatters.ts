// src/utils/formatters.ts
export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

export const formatDateShort = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
    weekday: 'short'
  });
};

export const formatHour = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
    hour: '2-digit'
  });
};

export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed * 3.6)} km/h`;
};

export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

export const formatHumidity = (humidity: number): string => {
  return `${humidity}%`;
};

export const formatVisibility = (visibility: number): string => {
  return `${Math.round(visibility / 1000)} km`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};