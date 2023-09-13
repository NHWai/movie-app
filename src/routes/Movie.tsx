import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReviewBox } from "../components/ReviewBox";
import { ReviewInput } from "../components/ReviewInput";
import { MyContext } from "../components/MyProvider";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarRateIcon from "@mui/icons-material/StarRate";
import { StarHalf } from "@mui/icons-material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMovieById, selectMovies } from "../features/movies/moviesSlice";
import { removeReviews, selectReviews } from "../features/reviews/reviewsSlice";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import SubHeading from "../components/SubHeading";
import { Slide } from "react-awesome-reveal";

const Movie = () => {
  const { token } = useContext(MyContext);
  let { id } = useParams();

  const movies = useAppSelector(selectMovies);
  const reviews = useAppSelector(selectReviews);

  const reviewArr = [...movies.movieDetails.reviews, ...reviews.items]
    .map((post) => JSON.stringify(post))
    .filter((str, idx, arr) => arr.indexOf(str) === idx)
    .map((str) => JSON.parse(str));
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0); //scroll to top

    if (movies.movieDetails.movie._id !== id) {
      dispatch(fetchMovieById(id as string));
      dispatch(removeReviews());
    }
  }, [id]);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: { max: 1024, min: 900 },
      items: 3,
      partialVisibilityGutter: 30,
    },
    mobileLarge: {
      breakpoint: { max: 900, min: 400 },
      items: 2,
    },
    mobileSmall: {
      breakpoint: { max: 400, min: 0 },
      items: 1,
    },
  };

  const ratingStar = Math.floor(
    movies.movieDetails?.movie?.totalRating as number
  );
  const halfStar = Number.isInteger(
    movies.movieDetails?.movie?.totalRating as number
  )
    ? 0
    : 1;
  const blankStar = 5 - ratingStar - halfStar;
  const ratingStarArr = ratingStar ? new Array(ratingStar).fill(1) : [];
  const blankStarArr = blankStar ? new Array(blankStar).fill(1) : [];

  return (
    <Box
      style={{ minHeight: `calc(100vh - 56px)` }}
      sx={{
        paddingX: 1,
        marginTop: "1rem",
        paddingBottom: "1rem",
        userSelect: "none",
      }}
    >
      {movies.movieDetails?.movie._id && movies.status === "idle" ? (
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
              Go Back
            </Button>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Typography
                flexGrow={1}
                mb="2rem"
                sx={{
                  typography: { xs: "h4", sm: "h3" },
                  fontWeight: "bold",
                  userSelect: "none",
                }}
                align="center"
              >
                {movies.movieDetails?.movie?.title}
              </Typography>
            </ThemeProvider>
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
              overflow: "hidden",
            }}
          >
            <Stack
              marginX={"auto"}
              width="fit-content"
              direction={{ md: "row" }}
              justifyContent={"start"}
              alignItems={{ xs: "start", md: "center" }}
              spacing={5}
              sx={{ marginBottom: "1rem" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: { xs: "fit-content", sm: "500px" },
                  height: "300px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "5px",
                    objectFit: "contain",
                  }}
                  src={movies.movieDetails?.movie?.photoUrl}
                  alt="coverPhoto"
                />
              </Box>
              {/* )} */}
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                }}
              >
                <SubHeading title="Details" />

                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Genres:{" "}
                  <b> {movies.movieDetails?.movie?.genres?.join(",")}</b>
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Directed by{" "}
                  <b> {movies.movieDetails?.movie?.director.name}</b>
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Released Date: {movies.movieDetails?.movie?.year}
                </Typography>
                <Typography variant="subtitle2" fontStyle={"italic"}>
                  Rating : {movies.movieDetails?.movie?.totalRating}
                </Typography>
                <Stack mt={1}>
                  <div>
                    {ratingStarArr.map((el, idx) => (
                      <Icon fontSize="small" key={idx}>
                        <StarRateIcon color="warning" />
                      </Icon>
                    ))}
                    {halfStar !== 0 && (
                      <Icon fontSize="small">
                        <StarHalf color="warning" />
                      </Icon>
                    )}
                    {blankStarArr.map((el, idx) => (
                      <Icon fontSize="small" key={idx}>
                        <StarBorderIcon color="warning" />{" "}
                      </Icon>
                    ))}
                  </div>
                  <Typography ml={1.5} variant="caption">
                    ( {movies.movieDetails?.reviews?.length + 1}{" "}
                    {movies.movieDetails?.reviews?.length + 1 === 1
                      ? "review"
                      : "reviews"}{" "}
                    )
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Box
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <SubHeading title="Details" />
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Genres: <b> {movies.movieDetails?.movie?.genres?.join(",")}</b>
              </Typography>
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Directed by <b> {movies.movieDetails?.movie?.director.name}</b>
              </Typography>
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Released Date: {movies.movieDetails?.movie?.year}
              </Typography>
              <Typography variant="subtitle2" fontStyle={"italic"}>
                Rating : {movies.movieDetails?.movie?.totalRating}
              </Typography>
              <Stack mt={1}>
                <div>
                  {ratingStarArr.map((el, idx) => (
                    <Icon fontSize="small" key={idx}>
                      <StarRateIcon color="warning" />
                    </Icon>
                  ))}
                  {halfStar !== 0 && (
                    <Icon fontSize="small">
                      <StarHalf color="warning" />
                    </Icon>
                  )}
                  {blankStarArr.map((el, idx) => (
                    <Icon fontSize="small" key={idx}>
                      <StarBorderIcon color="warning" />{" "}
                    </Icon>
                  ))}
                </div>
                <Typography ml={1.5} variant="caption">
                  ( {movies.movieDetails?.reviews?.length + 1}{" "}
                  {movies.movieDetails?.reviews?.length + 1 === 1
                    ? "review"
                    : "reviews"}{" "}
                  )
                </Typography>
              </Stack>
            </Box>
            {/* FEATURED REVIEWS */}
            <Stack
              width={"100%"}
              maxWidth={"700px"}
              alignSelf={"start"}
              fontStyle={"italic"}
            >
              <SubHeading title={"Featured Reviews"} />
              <Slide direction="up" triggerOnce={true}>
                <ReviewBox
                  rating={movies.movieDetails?.movie?.rating}
                  reviewText={movies.movieDetails?.movie?.review}
                  author={movies.movieDetails.movie.user.username}
                />
              </Slide>
              {reviewArr.map((review, idx) => {
                return (
                  <Box key={idx}>
                    <Slide direction="up">
                      <ReviewBox
                        reviewText={review.comment}
                        author={review.username}
                        rating={review.rating}
                      />
                    </Slide>
                  </Box>
                );
              })}
              {/*check token string, check login user is not original upload user of the movie ,check login user is not added review */}
              {token.tokenStr &&
                token.id !== movies.movieDetails?.movie?.user._id &&
                !reviewArr.some((el) => el.userId === token.id) && (
                  <>
                    <div
                      style={{
                        borderLeft: "3px solid blue",
                        paddingLeft: "1rem",
                        marginLeft: "-1rem",
                        marginBottom: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                      <Typography variant="h5" fontStyle={"italic"}>
                        Add review
                      </Typography>
                    </div>
                    <ReviewInput
                      movieId={movies.movieDetails?.movie?._id}
                      tokenStr={token.tokenStr}
                      userId={token.id}
                      username={token.username}
                    />
                  </>
                )}
            </Stack>
            {/* Movies with same genres*/}

            {movies.movieDetails.moreItems.length > 0 && (
              <Box
                sx={{
                  maxWidth: `${
                    window.innerWidth - 60 > 800 ? 800 : window.innerWidth - 60
                  }px`,
                }}
              >
                <SubHeading title="More Like This" />
                <Carousel responsive={responsive}>
                  {movies.movieDetails.moreItems.map((el, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        height: "230px",
                        padding: 1,
                        margin: 0.8,
                        borderRadius: "0.3rem",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                        }}
                        component={RouterLink}
                        to={`/movie/${el._id}`}
                      ></Box>
                      <Box
                        sx={{
                          height: "150px",
                          width: "100%",
                          mb: 1,
                        }}
                      >
                        <img
                          src={el.photoUrl}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={"bold"}
                        component="div"
                        align="center"
                      >
                        {el.title}
                      </Typography>
                      <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={0.5}
                      >
                        <Typography
                          variant="body2"
                          fontStyle={"italic"}
                        >{`Rating : ${el.rating}`}</Typography>
                        <Stack mt={-1}>
                          <Icon fontSize="small">
                            <StarRateIcon color="warning" />
                          </Icon>
                        </Stack>
                        <Typography variant="caption">
                          ({el.totalReviews}{" "}
                          {el.totalReviews === 1 ? "review" : "reviews"})
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Carousel>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            minHeight: "50vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Movie;
