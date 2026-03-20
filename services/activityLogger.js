let listeners = [];

let activities = [];

export const logActivity = (message) => {

  const newActivity = {
    id: Date.now(),
    message,
    time: new Date().toLocaleTimeString()
  };

  activities = [newActivity, ...activities];

  listeners.forEach((listener) => listener(activities));

};

export const subscribeToActivities = (callback) => {

  listeners.push(callback);

  // send existing logs immediately
  callback(activities);

  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };

};
