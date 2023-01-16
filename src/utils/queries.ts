export const getTrending = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data;
};

export const getNetflixOriginals = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_networks=213`
  );
  const data = await response.json();
  return data;
};

export const getTopRated = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data;
};

export const getActionMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=28`
  );
  const data = await response.json();
  return data;
};

export const getComedyMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=35`
  );
  const data = await response.json();
  return data;
};

export const getHorrorMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=27`
  );
  const data = await response.json();
  return data;
};

export const getRomanceMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=10749`
  );
  const data = await response.json();
  return data;
};

export const getDocumentaries = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&with_genres=99`
  );
  const data = await response.json();
  return data;
};

export const queryFns = {
  getTrending,
  getNetflixOriginals,
  getTopRated,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
};
