const API_URL = process.env.NEXT_PUBLIC_BACKEND_API + "/events";

export const fetchEvents = async () => {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};



export const createEvent = async (eventData: any , tasks: any) => {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return res.json();
};

export const updateEvent = async (id: number, updates: any) => {
  const res = await fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
};

export const deleteEvent = async (id: number) => {
  await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
  });
};
