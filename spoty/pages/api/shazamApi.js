import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { country_code = 'US', genre = 'HIP_HOP_RAP' } = req.query;
  const url = `https://shazam-api7.p.rapidapi.com/charts/get-top-songs-in_country_by_genre?country_code=${country_code}&genre=${genre}&limit=10`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '4f484c1165msh4c691a3476e9f2bp1746e1jsnb951a6563ff6',
      'X-RapidAPI-Host': 'shazam-api7.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
