export async function authenticate(request, redirect) {
  const token = request.headers.get("Authorization");

  if (!token) {
    return redirect("/login");
  }

  try {
    const response = await fetch("http://localhost:3000/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    return response;
  } catch (error) {
    return redirect("/error");
  }
}
