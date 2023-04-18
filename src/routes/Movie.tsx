import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MovielistType } from "./Home";
import { Link as RouterLink } from "react-router-dom";
import { ReviewBox } from "../components/ReviewBox";

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
    <Box sx={{ paddingX: 1, marginY: "1rem" }}>
      {movieItem ? (
        <>
          <Box
            sx={{
              p: { md: 1 },
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Button
              sx={{
                position: { md: "absolute" },
                top: 50,
                left: 0,
                transform: "translateY(-100%)",
                alignSelf: "start",
              }}
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
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
          </Box>
          <Box
            sx={{
              width: "fit-content",
              maxWidth: "800px",
              marginX: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              paddingX: "20px",
            }}
          >
            <Stack
              marginX={"auto"}
              width="fit-content"
              direction={{ xs: "column", md: "row" }}
              justifyContent={"start"}
              alignItems={{ xs: "start", md: "center" }}
              spacing={5}
            >
              {movieItem.photoUrl && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: { xs: "fit-content", sm: "500px" },
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "300px",
                      borderRadius: "5px",
                    }}
                    src={movieItem?.photoUrl}
                    alt="coverPhoto"
                  />
                </Box>
              )}
              <Box>
                <div
                  style={{
                    borderLeft: "3px solid blue",
                    paddingLeft: "1rem",
                    marginLeft: "-1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Typography fontStyle={"italic"} variant="h5">
                    Details
                  </Typography>
                </div>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Genres: <b> {movieItem?.genres?.join(",")}</b>
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Directed by <b> {movieItem?.director.name}</b>
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Released Date: {movieItem?.year}
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Rating : {movieItem?.rating}
                </Typography>
              </Box>
            </Stack>
            <Stack
              width={"100%"}
              maxWidth={"700px"}
              alignSelf={"start"}
              fontStyle={"italic"}
              mb={4}
            >
              <div
                style={{
                  borderLeft: "3px solid blue",
                  paddingLeft: "1rem",
                  marginLeft: "-1rem",
                  marginBottom: "1rem",
                }}
              >
                <Typography variant="h5">Featured Reviews</Typography>
              </div>
              <ReviewBox
                reviewText={movieItem?.review}
                author="Original Uploader"
              />
              <ReviewBox
                reviewText={movieItem?.review}
                author="Original Uploader"
              />
            </Stack>
          </Box>
        </>
      ) : (
        <Stack minHeight={"50vh"} justifyContent="center" alignItems={"center"}>
          Loading
        </Stack>
      )}
    </Box>
  );
};

export default Movie;
