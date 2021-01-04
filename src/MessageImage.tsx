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
  ActivityIndicator,
} from 'react-native'
// TODO: support web
// @ts-ignore
import Lightbox from 'react-native-lightbox'
import { IMessage } from './Models'
import { StylePropType } from './utils'



const styles = StyleSheet.create({
  container: {},
  image: {
    margin: 0,
    resizeMode: 'contain',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: "center",
    justifyContent: "center",
  }
})

export interface MessageImageProps<TMessage extends IMessage> {
  firstMessage?: boolean;
  hasNextMessage?: boolean;
  position?: "left" | "right";
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  imageProps?: Partial<ImageProps>
  lightboxProps?: object
}

export const LoadingOverlay: React.FC<{ loading: boolean }> = (props) => {

  if (!props.loading) return null;

  return (
    <View style={[styles.loadingOverlay, StyleSheet.absoluteFill]}>
      <ActivityIndicator size={"small"} />
    </View>
  );
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
    firstMessage: false,
    position: "right"
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
    lightboxOpen: false,
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
      overflow: "visible",
      alignSelf: "center",
      margin: 0,
    } as any;

    const borderStyle = {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    }

    if (this.props.firstMessage) {
      if (!this.props.hasNextMessage) {
        borderStyle.borderTopLeftRadius = borderStyle.borderTopRightRadius = 14;
      }
    }
    
    if (this.props.position === "left") {
      borderStyle.borderTopRightRadius = 14;
    } else {
      borderStyle.borderTopLeftRadius = 14;
    }

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
                style={[styles.image, imageStyle, { height: "100%", width: "100%" }, borderStyle]}
                source={content}
              />
            }
          </View>);
      }
      else {
        return (
          <View style={[styles.container, containerStyle]}>
            <Lightbox
              activeProps={{
                style: styles.imageActive,
              }}
              renderHeader={() => null}
              onOpen={() => this.setState({lightboxOpen: true})}
              onClose={() => this.setState({lightboxOpen: false})}
              {...lightboxProps}
            >
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
                    style={[styles.image, imageStyle, { height: "100%", width: "100%" }, borderStyle]}
                    source={content}
                  />
                }
                <LoadingOverlay loading={this.props.currentMessage?.pending && !this.state.lightboxOpen || false} />
              </View>
            </Lightbox>
          </View>
        );
      }
    }
    return null;
  }
}
