import { IconButton, Grid, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardItem } from "./CardItem";
import { MuiLayout } from "./MuiLayout";
import AddIcon from "@mui/icons-material/Add";
import { MovieType } from "./AddMovie";
import { MyContext } from "./MyProvider";

export type MovielistType = MovieType & {
  _id: string;
  user: string;
};
export const Home = () => {
  const [movieList, setmovieList] = useState<MovielistType[] | undefined>();
  const { token } = useContext(MyContext);
  const [movId, setMovId] = useState<string>("");
  const navigate = useNavigate();

  React.useEffect(() => {
    setmovieList((pre) => pre?.filter((el) => el._id !== movId));
  }, [movId]);

  React.useEffect(() => {
    const getMovies = async () => {
      const endpoint = `${process.env.REACT_APP_BASE_URL}/movies`;

      try {
        const res = await fetch(endpoint, {
          method: "GET",
          redirect: "follow",
        });
        const { data } = await res.json();

        if (res.status === 200) {
          setmovieList(data);
        } else {
          throw new Error(`${data.message}`);
        }
      } catch (err) {
        navigate(`/error/${err}`);
      }
    };
    console.log("get new movies");
    getMovies();
  }, [navigate]);

  return (
    <MuiLayout>
      <Stack
        spacing={2}
        mb={"3rem"}
        justifyContent={"center"}
        alignItems={"center"}
        direction={"row"}
      >
        <Typography variant="h3">All Movies</Typography>
        {token.tokenStr && (
          <Link to="/create">
            <IconButton size="large" color="success">
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Link>
        )}
      </Stack>
      {movieList?.length === 0 && (
        <Stack
          minHeight={"50vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          No Movies
        </Stack>
      )}
      {movieList === undefined && (
        <Stack
          minHeight={"50vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          Loading
        </Stack>
      )}
      <Grid container spacing={2} rowSpacing={3}>
        {/* <Grid item xs={12} sm={6} md={4}>
          Add
        </Grid> */}
        {movieList?.map((el) => {
          const { rating, review, year, title, director, _id: id, user } = el;
          return (
            <Grid key={id} item xs={12} sm={6} md={4}>
              <CardItem
                movieid={id}
                directorname={director.name}
                year={year}
                review={review}
                rating={rating}
                title={title}
                user={user}
                setMovId={setMovId}
              />
            </Grid>
          );
        })}
      </Grid>
    </MuiLayout>
  );
};
