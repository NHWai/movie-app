import { Grid, Stack, Typography, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <Typography
        mb={"3rem"}
        align="center"
        sx={{ typography: { xs: "h4", sm: "h3", lg: "h2" } }}
      >
        All Movies
      </Typography>

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
        {token.tokenStr && (
          <Grid item xs={12}>
            <Stack height={50}>
              <Button
                onClick={() => navigate("/create")}
                sx={{
                  width: "fit-content",
                  size: { xs: "small", sm: "large" },
                }}
                variant="contained"
                color="success"
                endIcon={<AddIcon fontSize="inherit" />}
              >
                Create
              </Button>
            </Stack>
          </Grid>
        )}
        {movieList?.map((el) => {
          const { rating, review, year, title, director, _id: id, user } = el;
          return (
            <Grid key={id} item xs={12} sm={6} md={4} lg={3}>
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
