import {
  Grid,
  Stack,
  Typography,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useContext, useState } from "react";
import {
  Link as RouterLink,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { movieGenres, MovieType } from "./AddMovie";
import { CardItem } from "../components/CardItem";
import { MuiLayout } from "../components/MuiLayout";
import { MyContext } from "../components/MyProvider";
import Box from "@mui/system/Box";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getAllMovies,
  getMoviesByGenre,
  getMoviesByUserId,
  selectMovies,
  getMoviesByGenresWithUserId,
  fetchAllMovies,
} from "../features/movies/moviesSlice";
import theme from "../config/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Fade } from "react-awesome-reveal";

export type MovielistType = MovieType & {
  _id: string;
  user: string;
  photoUrl: string;
  totalReviews: number;
};
export const Home = () => {
  const { token } = useContext(MyContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const movies = useAppSelector(selectMovies);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    !movies.items.length && dispatch(fetchAllMovies());
  }, []);
  React.useEffect(() => {
    const selectedGenre = searchParams.get("genres");
    const moviesByUserid = searchParams.get("userid");
    if (moviesByUserid && selectedGenre) {
      dispatch(
        getMoviesByGenresWithUserId({ userId: token.id, genre: selectedGenre })
      );
    } else if (selectedGenre) {
      dispatch(getMoviesByGenre(selectedGenre));
    } else if (moviesByUserid) {
      dispatch(getMoviesByUserId(moviesByUserid));
    } else {
      dispatch(getAllMovies());
    }
  }, [searchParams, movies.status]);

  return (
    <MuiLayout>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography
          mb={"3rem"}
          align="center"
          sx={{
            typography: { xs: "h4", sm: "h3", lg: "h3" },
            userSelect: "none",
          }}
        >
          {searchParams.get("userid") && token ? "My Movies" : "All Movies"}
        </Typography>
      </ThemeProvider>

      <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, mb: 4 }}>
        {token.tokenStr && (
          <div>
            <Button
              component={RouterLink}
              to="/create"
              sx={{
                width: "fit-content",
              }}
              variant="contained"
              color="success"
              endIcon={<AddIcon fontSize="inherit" />}
            >
              Create
            </Button>
          </div>
        )}
        <Autocomplete
          value={searchParams.get("genres") || null}
          onChange={(event: any, newValue: string | null) => {
            const moviesByUserid = searchParams.get("userid");
            if (!newValue) {
              setSearchParams("");
              moviesByUserid && setSearchParams({ userid: moviesByUserid });
              dispatch(getAllMovies());
            } else {
              // setSearchParams(`?genres=${newValue}`);
              moviesByUserid
                ? setSearchParams({ userid: moviesByUserid, genres: newValue })
                : setSearchParams({ genres: newValue });
            }
          }}
          size="small"
          disablePortal
          options={movieGenres}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Search by genres" />
          )}
        />
      </Box>

      {searchParams.get("genres") && (
        <Typography
          variant="caption"
          fontStyle={"italic"}
          sx={{ display: { xs: "block", sm: "none" }, mb: 2 }}
        >
          Genre:<b> {searchParams.get("genres")} </b>
        </Typography>
      )}

      {movies.status === "loading" && (
        <Box
          sx={{
            display: "flex",
            minHeight: "40vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {movies.filteredItems.length === 0 && movies.status === "idle" && (
        <Stack
          minHeight={"50vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          No Movies
        </Stack>
      )}

      <Grid container spacing={2} rowSpacing={3}>
        {movies.filteredItems.map((el) => {
          const {
            totalRating,
            genres,
            year,
            title,
            director,
            _id: id,
            user,
            photoId,
            totalReviews,
            photoUrl,
          } = el;
          return (
            <Grid key={id} item xs={12} sm={6} md={4} lg={3}>
              <Fade triggerOnce={true} delay={100}>
                <CardItem
                  photoId={photoId as string}
                  movieid={id}
                  directorname={director.name}
                  year={year}
                  genres={genres}
                  rating={totalRating as number}
                  title={title}
                  user={user._id as string}
                  totalReviews={totalReviews}
                  photoUrl={photoUrl}
                />
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    </MuiLayout>
  );
};
