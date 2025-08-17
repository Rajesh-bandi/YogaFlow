export async function getPixabayImage(poseName: string, sanskritName?: string): Promise<string> {
  const apiKey = "41280069-7d94ddd46d33364247a56f9a3";
  // Use both English and Sanskrit names, and append 'yoga pose' for accuracy
  const query = encodeURIComponent(`yoga ${poseName}${sanskritName ? ' ' + sanskritName : ''} yoga pose`);
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&per_page=5`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      // Always pick the first result for consistency
      return data.hits[0].webformatURL;
    }
  } catch (e) {
    // fallback image if API fails
    return "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=300";
  }
  // fallback image if no results
  return "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=300";
}
