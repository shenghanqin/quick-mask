import Taro from '@tarojs/taro'
import { View, ScrollView, Image, Block } from '@tarojs/components'
import { cloudCallFunction } from 'utils/fetch'
import { imageThumb } from 'utils/common';

import './styles.styl'

export default class ThemeDetail extends Taro.Component {
  config = {
    component: true
  }

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    themeId: 0,
    themeData: {},
    isCurrentShow: false,
    onSwitch: () => {},
  }
  
  constructor(props) {
    super(props)
    this.state = {
      shapeCategoryList: [],
      isShowShape: props.isCurrentShow
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isCurrentShow && nextProps.isCurrentShow) {
      this.setState({
        isShowShape: true
      })
    }
  }

  componentDidMount() {
    const { themeId } = this.props
    if (themeId) {
      cloudCallFunction({
        name: 'hiface-api',
        data: {
          $url: 'theme/get',
          themeId,
          needShapes: true
        }
      }).then(res => {
        const { shapeCategoryList = [] } = res
        if (shapeCategoryList.length > 0) {
          this.setState({
            shapeCategoryList
          })

        }
      }).catch(error => console.log('error >> ', error))
    }
  }

  onSwitch = () => {
    const { onSwitch, themeId } = this.props
    onSwitch(themeId)
  }

  render() {
    const { themeData } = this.props
    const { shapeCategoryList, isShowShape } = this.state
    const { shareImageUrl, shareDesc, themeName, shareTitleSlug } = themeData

    return (
      <ScrollView className="theme-scroll" scrollY>
        <View className="theme-item" onClick={this.onSwitch}>
          <View className="theme-header">
            <View className="theme-main">
              <View className="share-title">{themeName}</View>
              <View className="share-title-slug">{shareTitleSlug}</View>
              <View className="share-desc">{shareDesc}</View>
            </View>
            <Image className="theme-cover" src={imageThumb(shareImageUrl, 280, 280)} webp />
          </View>
          {
            isShowShape && (
              <Block>
                <View className="theme-title">
                  {themeName}贴纸
                </View>
                <View className="theme-wrap">
                  {
                    shapeCategoryList.map((category) => {
                      const { _id: categoryId, categoryName, shapeList = [] } = category
                      let showList = shapeList.filter((item, index) => index < 4)
                      return (
                        <View key={categoryId} className='category-item'>
                          <View className='shape-list'>
                            {
                              showList.map((shape) => {
                                const { _id: shapeId, imageUrl } = shape
                                return (
                                  <Image className='shape-item' key={shapeId} webp src={imageThumb(imageUrl, 100, 100)} />
                                )
                              })
                            }
                          </View>
                          <View className='category-hd'>{categoryName}</View>
                        </View>
                      )
                    })
                  }
                </View>
              </Block>
            )
          }

        </View>
      </ScrollView>
    )
  }
}