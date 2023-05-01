import {
  Grid,
  Stack,
  Typography,
  Button,
  Autocomplete,
  TextField,
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

export type MovielistType = MovieType & {
  _id: string;
  user: string;
  photoUrl: string;
  totalReviews: number;
};
export const Home = () => {
  const [movieList, setmovieList] = useState<MovielistType[] | null>();
  const [movId, setMovId] = useState<string>("");
  const { token } = useContext(MyContext);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const selectedGenre = searchParams.get("genres");
    if (selectedGenre) {
      getMoviesByGenre(selectedGenre);
    } else {
      getMovies();
    }
  }, [searchParams]);

  React.useEffect(() => {
    setmovieList((pre) => pre?.filter((el) => el._id !== movId));
  }, [movId]);

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

  const getMoviesByGenre = async (movieGenre: string) => {
    const endpoint = `${process.env.REACT_APP_BASE_URL}/movies/genre/${movieGenre}`;
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        redirect: "follow",
      });
      const data = await res.json();
      if (res.status === 200) {
        setmovieList(data.data);
      } else {
        throw new Error(`${data.message}`);
      }
    } catch (err) {
      navigate(`/error/${err}`);
    }
  };

  return (
    <MuiLayout>
      <Typography
        mb={"3rem"}
        align="center"
        sx={{ typography: { xs: "h4", sm: "h3", lg: "h2" } }}
      >
        All Movies
      </Typography>

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
            !newValue
              ? setSearchParams("")
              : setSearchParams(`?genres=${newValue}`);
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

      {movieList === undefined && (
        <Stack
          minHeight={"50vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          Loading
        </Stack>
      )}

      {movieList?.length === 0 && (
        <Stack
          minHeight={"50vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          No Movies
        </Stack>
      )}
      <Grid container spacing={2} rowSpacing={3}>
        {movieList?.map((el) => {
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
          } = el;
          return (
            <Grid key={id} item xs={12} sm={6} md={4} lg={3}>
              <CardItem
                photoId={photoId as string}
                movieid={id}
                directorname={director.name}
                year={year}
                genres={genres}
                rating={totalRating as number}
                title={title}
                user={user}
                totalReviews={totalReviews}
                setMovId={setMovId}
              />
            </Grid>
          );
        })}
      </Grid>
    </MuiLayout>
  );
};
