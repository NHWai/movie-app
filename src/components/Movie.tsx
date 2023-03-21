import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MovielistType } from "./Home";

type CastType = {
  _id: string;
  movie: string;
  protagonist: string;
  allie_rival: string;
};

const Movie = () => {
  let { id } = useParams();
  const [movieItem, setMovieItem] = useState<MovielistType>();
  const [casts, setCasts] = useState<CastType>();

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
        const fetchMovie = await fetchData(url, id, setMovieItem);
        if (!fetchMovie) {
          throw Error("failed to fetch movie");
        }

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
          <Stack>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ width: "fit-content" }}
              color="inherit"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              flexGrow={1}
              mb="2rem"
              sx={{
                typography: { xs: "h5", sm: "h3", lg: "h2" },
                fontWeight: "bold",
              }}
              align="center"
            >
              {movieItem?.title}
            </Typography>
          </Stack>
          <Typography sx={{ typography: { md: "h5" } }}>
            Directed by {movieItem?.director.name}
          </Typography>
          <Typography variant="subtitle1" fontStyle={"italic"} mb="1rem">
            Released Date: {movieItem?.year}
          </Typography>
          {casts ? (
            <>
              <div>Casts :</div>
              <ul>
                <li>
                  Protagonist:
                  <b>
                    <i> {casts?.protagonist} </i>
                  </b>
                </li>
                <li>
                  Alley/Rival:
                  <b>
                    <i> {casts?.allie_rival} </i>{" "}
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
