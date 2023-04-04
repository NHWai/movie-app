import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MovielistType } from "./Home";
import { Link as RouterLink } from "react-router-dom";

type CastType = {
  _id: string;
  movie: string;
  protagonist: string;
  allie_rival: string;
};

const Movie = () => {
  let { id } = useParams();
  const [movieItem, setMovieItem] = useState<MovielistType>();
  const [casts, setCasts] = useState<CastType[]>([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    const url = "movies";
    const url2 = "casts/movie";
    const fetchData = async (
      url: string,
      id: string,
      setFunc: (smth: any) => void
    ) => {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/${url}/${id}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );
      const data = await res.json();

      if (res.status === 200) {
        setFunc(data.data);
        return true;
      } else {
        return false;
      }
    };
    const getData = async (id: string) => {
      try {
        //fetching movie
        const fetchMovie = await fetchData(url, id, setMovieItem);
        if (!fetchMovie) {
          throw Error("failed to fetch movie");
        }

        //fetching casts
        fetchData(url2, id, setCasts);
      } catch (err) {
        console.log({ err });
        navigate(`/error/${err}`);
      }
    };
    id && getData(id);
  }, [id, navigate]);

  return (
    <Box sx={{ marginLeft: "1rem", marginY: "1rem" }}>
      {movieItem ? (
        <div>
          <Stack p={1}>
            <Button
              sx={{ alignSelf: "flex-start", mb: 2 }}
              startIcon={<ArrowBackIcon />}
              component={RouterLink}
              to={`/`}
            >
              Main Page
            </Button>
            <Typography
              flexGrow={1}
              mb="2rem"
              sx={{
                typography: { xs: "h4", sm: "h3", lg: "h2" },
                fontWeight: "bold",
              }}
              align="center"
            >
              {movieItem?.title}
            </Typography>
          </Stack>
          {movieItem.photoUrl && (
            <img
              style={{ maxWidth: "300px", height: "300px" }}
              src={movieItem?.photoUrl}
              alt="coverPhoto"
            />
          )}
          <Stack p={2} fontStyle={"italic"} mb={4} maxWidth={"280px"}>
            <Typography variant="body1">{movieItem?.review}</Typography>
            <Typography variant="caption" align="right">
              Reviewed by <br />
              Author
            </Typography>
          </Stack>
          <Typography variant="subtitle1">
            Genres: <b> {movieItem?.genres?.join(",")}</b>
          </Typography>
          <Typography variant="subtitle1">
            Directed by <b> {movieItem?.director.name}</b>
          </Typography>
          <Typography variant="subtitle1" fontStyle={"italic"} mb="1rem">
            Released Date: {movieItem?.year}
          </Typography>
          {casts.length > 0 ? (
            <>
              <div>Casts :</div>
              <ul>
                <li>
                  Protagonist:
                  <b>
                    <i> {casts[0].protagonist} </i>
                  </b>
                </li>
                <li>
                  Alley/Rival:
                  <b>
                    <i> {casts[0].allie_rival} </i>{" "}
                  </b>
                </li>
              </ul>
            </>
          ) : (
            <Button
              onClick={() => navigate(`/cast/${movieItem._id}`)}
              size="small"
            >
              Add Cast
            </Button>
          )}
        </div>
      ) : (
        <Stack minHeight={"50vh"} justifyContent="center" alignItems={"center"}>
          Loading
        </Stack>
      )}
    </Box>
  );
};

export default Movie;
