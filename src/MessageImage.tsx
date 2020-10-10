import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  View,
  ImageProps,
  ViewStyle,
  StyleProp,
  ImageStyle,
  ImageURISource,
  Platform,
  Text,
} from 'react-native'
// TODO: support web
// @ts-ignore
import Lightbox from 'react-native-lightbox'
import { IMessage } from './Models'
import { StylePropType } from './utils'

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    margin: 0,
    resizeMode: 'contain',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
})

export interface MessageImageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  imageProps?: Partial<ImageProps>
  lightboxProps?: object
}

export default class MessageImage<
  TMessage extends IMessage = IMessage
  > extends Component<MessageImageProps<TMessage>> {
  static defaultProps = {
    currentMessage: {
      image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: StylePropType,
    imageStyle: StylePropType,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
  }

  state = {
    loading: true,
    error: false,
  }

  render() {
    const { containerStyle, lightboxProps, imageProps, imageStyle, currentMessage, } = this.props;

    const content: ImageURISource = currentMessage?.image as ImageURISource;
    const ratio = content?.width && content?.height ? content.width / content!.height : 1;
    const width = content?.width ? Math.min(content.width, 150) : 150;

    const imageContainerStyles = {
      width: width || 150,
      height: width / ratio || 150,
      justifyContent: "center",
      overflow: "hidden",
      alignSelf: "center",
      margin: 0
    } as any;

    if (!!currentMessage) {
      if (Platform.OS === 'web') {
        return (
          <View
            style={imageContainerStyles}
          >
            {this.state.error ?
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a" }}>
                <Text style={{ color: "#494949", fontSize: 64 }}>
                  !
                  </Text>
              </View>
              : <Image
                {...imageProps}
                style={[styles.image, imageStyle, { height: "100%", width: "100%" }]}
                source={content}
              />
            }
          </View>);
      }
      else {
        return (<View style={[styles.container, containerStyle]}>
          <Lightbox activeProps={{
            style: styles.imageActive,
          }} {...lightboxProps}>
            <View
              style={imageContainerStyles}
            >
              {this.state.error ?
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a" }}>
                  <Text style={{ color: "#494949", fontSize: 64 }}>
                    !
                </Text>
                </View>
                : <Image
                  {...imageProps}
                  style={[styles.image, imageStyle, { height: "100%", width: "100%" }]}
                  source={content}
                />
              }
            </View>
          </Lightbox>
        </View>);
      }
    }
    return null;
  }
}
