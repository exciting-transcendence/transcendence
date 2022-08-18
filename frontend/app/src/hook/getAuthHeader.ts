export const getAuthHeader = () => {
  const token = window.localStorage.getItem('access_token') || ''
  const authHeader = `Bearer ${token}`

  return { headers: { Authorization: authHeader } }
}
