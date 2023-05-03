import React from "react";
import { styled } from "@mui/material/styles";
import Carousel from "react-multi-carousel";

const CardContainer = styled("div")({
  height: "300px",
  width: "100%",
});

interface CardSliderProps {
  children: React.ReactNode;
}

const CardSlider = ({ children }: CardSliderProps) => {
  const cards = [
    {
      title: "Card 1",
      image:
        "https://plus.unsplash.com/premium_photo-1682577785169-305659e87b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Card 2",
      image:
        "https://images.unsplash.com/photo-1682752149354-e55220a3494b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      content: "Pellentesque pulvinar augue vel laoreet tristique.",
    },
    {
      title: "Card 3",
      image:
        "https://images.unsplash.com/photo-1682711274476-02947d6b4699?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      content: "Integer quis mi eu sapien vehicula elementum.",
    },
    {
      title: "Card 4",
      image:
        "https://plus.unsplash.com/premium_photo-1682577785169-305659e87b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Card 5",
      image:
        "https://images.unsplash.com/photo-1682752149354-e55220a3494b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      content: "Pellentesque pulvinar augue vel laoreet tristique.",
    },
    {
      title: "Card 6",
      image:
        "https://images.unsplash.com/photo-1682711274476-02947d6b4699?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      content: "Integer quis mi eu sapien vehicula elementum.",
    },
  ];

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <Carousel responsive={responsive}>
        {children}
        {/* {cards.map((card, i) => (
            <Box
              sx={{
                width: "fit-content",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                padding: "10px",
                margin: "5px",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
              key={i}
            >
              <CardContainer>
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  src={card.image}
                  alt={`Card ${i + 1}`}
                />
              </CardContainer>
              <Box>
                <Typography variant="h5">{card.title}</Typography>
                <Typography variant="body1">{card.content}</Typography>
              </Box>
            </Box>
          ))} */}
      </Carousel>
    </>
  );
};

export default CardSlider;
