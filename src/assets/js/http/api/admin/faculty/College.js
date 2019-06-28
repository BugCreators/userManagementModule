import http from "../../../http";

export default {
  /**
   * @description 学院管理-获取学院列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getCollegeListByAdmin: data => {
    return http({
      url: "/api/college/getCollegeListByAdmin",
      method: "post",
      data
    });
  },
  /**
   * @description 学院管理-删除学院
   * @param { collegesId } 学院ID
   */
  delCollege: data => {
    return http({
      url: "/api/college/deleteCollege",
      method: "post",
      data
    });
  },
  /**
   * @description 学院管理-导出数据-获取全部学院数据
   */
  getAllCollegeList: data => {
    return http({
      url: "/api/college/getAllCollegeList",
      method: "post",
      data
    });
  },
  /**
   * @descrition 学院管理-学院详情-获取学院详情
   * @param { id } 学院ID
   */
  getCollegeDetailByAdmin: params => {
    return http({
      url: "/api/college/getCollegeDetailByAdmin",
      method: "get",
      params
    });
  },
  /**
   * @description 学院管理-学院详情-修改学院信息
   * @param { info.id }      学院ID
   * @param { info.name }    学院名
   * @param { info.en_name } 英文名
   * @param { info.description }  学院描述
   * @param { info.website }      学院官网
   */
  changeCollege: data => {
    return http({
      url: "/api/college/changeCollegeDetail",
      method: "post",
      data
    });
  },
  /**
   * @description 学院管理-学院详情-添加学院
   * @param { info.name }    学院名
   * @param { info.en_name } 英文名
   * @param { info.description }  学院描述
   * @param { info.website }      学院官网
   */
  addCollege: data => {
    return http({
      url: "/api/college/addCollege",
      method: "post",
      data
    });
  },
  /**
   * @description 学院管理-批量添加
   * @param { collegeList } 学院数据
   */
  importCollegeList: data => {
    return http({
      url: "/api/college/importCollegeList",
      method: "post",
      data
    });
  },
  /**
   * @description 学院管理-院徽管理-获取院徽
   * @param { id } 学院ID
   */
  getCollegeLogo: params => {
    return http({
      url: "/api/college/getCollegeLogo",
      method: "get",
      params
    });
  },
  /**
   * @description 学院管理-院徽管理-上传院徽
   * @param { file } 院徽图片
   * @param { id }   学院ID
   */
  changeCollegeLogo: data => {
    return http({
      url: "/api/college/changeCollegeLogo",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data
    });
  },
  /**
   * @description 学院管理-院徽管理-删除院徽
   * @param { id } 学院ID
   */
  deleteCollegeLogo: data => {
    return http({
      url: "/api/college/deleteCollegeLogo",
      method: "post",
      data
    });
  }
};
