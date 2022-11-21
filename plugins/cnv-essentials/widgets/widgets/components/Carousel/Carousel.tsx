import React, { useState } from 'react'
import { Dots } from '@brainhubeu/react-carousel'
import { makeStyles } from '@material-ui/core/styles'
import CustomSlide from '../../../components/CustomSlide'
import CustomSlideProduct from '../../../components/CustomSlideProduct'
import CustomButton from '../../../components/CustomButton'
import CustomCarousel from '../../../components/CustomCarousel'
import { CarouselType } from '../../../constants'

const useStyles = makeStyles(() => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  carousel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexFlow: 'row',
    alignContent: 'center',
    textAlign: 'center',
    height: '100%',
    backgroundColor: '#fbfbfb',
    '& [class*="-text-"]': {
      overflow: 'hidden'
    }
  },
  button: {
    paddingBottom: 16,
    backgroundColor: '#fbfbfb'
  },
  dots: {
    paddingBottom: 10,
    backgroundColor: '#fbfbfb'
  }
}))

function Carousel({
  slides: carouselSlides,
  buttonText,
  buttonType,
  connection,
  ui
}) {
  const [index, setIndex] = useState(0)
  const classes = useStyles()

  const setIndexOnChange = (currIndex: any) => {
    setIndex(currIndex)
  }

  const slides = carouselSlides.map((props, idx) => {
    if (props.carouselType === CarouselType.NORMAL) {
      return (
        <CustomSlide
          {...props}
          index={idx}
          activeIndex={index}
          connection={connection}
        />
      )
    } else if (props.carouselType === CarouselType.PRODUCT) {
      return <CustomSlideProduct {...props} index={idx} activeIndex={index} />
    }
  })

  return (
    <div className={classes.main}>
      <div className={classes.carousel}>
        <CustomCarousel
          slides={slides}
          setIndexOnChange={setIndexOnChange}
          value={index}
        />
        <Dots
          value={index}
          onChange={setIndexOnChange}
          number={slides.length}
          className={classes.dots}
        />
      </div>
      <div className={classes.button}>
        <CustomButton
          sendValueOnClick={() => {
            connection.send('FINISH')
            ui.showOverlayComponent(false)
          }}
          text={buttonText}
          customWidth='70%'
          buttonType={buttonType}
        />
      </div>
    </div>
  )
}

export default Carousel
