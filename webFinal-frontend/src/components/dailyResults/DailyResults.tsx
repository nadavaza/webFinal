// import { BalldontlieAPI } from "@balldontlie/sdk";
// import { useEffect, useState } from "react";

// const api = new BalldontlieAPI({ apiKey: "43d432e4-046c-40fb-9a82-98165ecacc05" });

// const [games, setGames] = useState<any[]>([]);

// useEffect(() => {
//   const fetchGames = async () => {
//     const today = new Date().toISOString().split("T")[0];
//     const fetchedGames = await api.nba.getGames({ dates: [today] });
//     console.log(fetchedGames);

//     // setGames(fetchedGames);
//   };

//   fetchGames();
// }, []);
