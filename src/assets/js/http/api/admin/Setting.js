import http from "../../http";

export default {
  /**
   * @description 系统设置-修改学校信息
   * @param { schoolInfo }         学校信息
   * @param { schoolInfo.name }    学校名
   * @param { schoolInfo.address } 学校地址
   */
  changeSchoolInfo: params => {
    return http({
      url: "/api/system/changeSchoolInfo",
      method: "get",
      params
    });
  },
  /**
   * @description 系统设置-修改其他系统信息
   * @param { system }         系统信息
   * @param { system.name }    系统名
   * @param { system.website } 系统链接
   */
  changeSystemItem: params => {
    return http({
      url: "/api/system/changeSystemItem",
      method: "get",
      params
    });
  },
  /**
   * @description 系统设置-删除系统链接
   * @param { index } 系统链接index
   */
  deleteSystemItem: params => {
    return http({
      url: "/api/system/deleteSystemItem",
      method: "get",
      params
    });
  },
  /**
   * @description 系统设置-添加系统-添加系统链接
   * @param { system }         系统信息
   * @param { system.name }    系统名
   * @param { system.website } 系统链接
   */
  addSystemItem: params => {
    return http({
      url: "/api/system/addSystemItem",
      method: "get",
      params
    });
  },
  /**
   * @description 系统设置-删除轮播图
   * @param { index } 轮播图index
   */
  deleteCarouselItem: params => {
    return http({
      url: "/api/system/deleteCarouselItem",
      method: "get",
      params
    });
  },
  /**
   * @description 系统设置-修改轮播图链接
   * @param { index }   轮播图index
   * @param { website } 链接
   */
  changeCarouselItemWebsite: params => {
    return http({
      url: "/api/system/changeCarouselItemWebsite",
      method: "get",
      params
    });
  },
  /**
   * @description 系统设置-轮播图详情-获取轮播图
   * @param { index } 轮播图index
   */
  getCarouselItem: params => {
    return http({
      url: "/api/system/getCarouselItem",
      method: "get",
      params
    });
  },
  /**
   * @description 系统设置-轮播图详情-修改轮播图图片
   * @param { image } 图片文件
   */
  changeCarouselItemPicture: data => {
    return http({
      url: "/api/system/changeCarouselItemPicture",
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  /**
   * @description 系统设置-轮播图详情-修改轮播图图片
   * @param { image } 图片文件
   */
  addCarouselItem: data => {
    return http({
      url: "/api/system/addCarouselItem",
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};
