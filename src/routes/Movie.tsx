import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MovielistType } from "./Home";
import { ReviewBox } from "../components/ReviewBox";
import { ReviewInput } from "../components/ReviewInput";
import { MyContext } from "../components/MyProvider";

interface MovieItemType {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  title: string;
  director: {
    name: string;
    gender: string;
  };
  genres: string[];
  totalRating: number;
  rating: number;
  review: string;
  year: number;
  photoUrl: string;
  photoId: string;
}

interface ReviewType {
  _id: string;
  rating: number;
  comment: string;
  movieId: string;
  userId: string;
  username: string;
}

const Movie = () => {
  const { token } = useContext(MyContext);
  let { id } = useParams();
  const [movieItem, setMovieItem] = useState<MovieItemType>();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const url = "movies";
    const url2 = "reviews";
    const getData = async (id: string) => {
      try {
        //fetching movie
        const fetchMovie = await fetchData(url, id, setMovieItem);
        if (!fetchMovie) {
          throw Error("failed to fetch movie");
        }

        //fetching reviews
        fetchData(url2, id, setReviews);
      } catch (err) {
        console.log({ err });
        navigate(`/error/${err}`);
      }
    };
    id && getData(id);
  }, [id, navigate, isSubmit]);

  const fetchData = async (
    url: string,
    id: string,
    setFunc: (smth: any) => void
  ) => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/${url}/${id}`, {
      method: "GET",
      redirect: "follow",
    });
    const data = await res.json();

    if (res.status === 200) {
      setFunc(data.data);
      return true;
    } else {
      return false;
    }
  };

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
                  Rating : {movieItem?.totalRating}
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
                rating={movieItem.rating}
                reviewText={movieItem?.review}
                author={movieItem.user.username}
              />
              {reviews.map((review, idx) => {
                return (
                  <ReviewBox
                    key={idx}
                    reviewText={review.comment}
                    author={review.username}
                    rating={review.rating}
                  />
                );
              })}
              {/*check token string, check login user is not original upload user of the movie ,check login user is not added review */}
              {token.tokenStr &&
                token.id !== movieItem.user._id &&
                !reviews?.some((el) => el.userId === token.id) && (
                  <>
                    <Typography my={2} variant="h6" fontStyle={"italic"}>
                      Add review
                    </Typography>
                    <ReviewInput
                      movieId={movieItem._id}
                      tokenStr={token.tokenStr}
                      userId={token.id}
                      username={token.username}
                      setIsSubmit={setIsSubmit}
                    />
                  </>
                )}
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
