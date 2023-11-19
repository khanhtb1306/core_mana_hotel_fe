import Modal from "../UI/Modal";
import { useState } from "react";
import { Form } from "react-router-dom";

function PersonFeeModal(props) {
  const categories = props.categories;
  // console.log(categories);
  // console.log(props.listAdult);
  // console.log(props.listChildren);
  const listDefaultPersonFee = categories.map((category, i) => {
    const listAdultByCateId =
      props.listAdult.LIST_ADDITIONAL_ADULT_SURCHARGE_DETAIL.filter(
        (adult) =>
          adult.roomCategory.roomCategoryId ===
          category.roomCategory.roomCategoryId
      );
    let listAdult = [];
    if (listAdultByCateId.length > 0) {
      listAdult = listAdultByCateId.map((adult) => {
        return {
          key: adult.policyDetailId,
          policyDetailId: adult.policyDetailId,
          number: adult.limitValue,
          price: adult.policyValue,
        };
      });
    } else {
      listAdult = [
        {
          number: 1,
          price: 0,
        },
      ];
    }
    // console.log(listAdult);
    const listChildrenByCateId =
      props.listChildren.LIST_ADDITIONAL_CHILDREN_SURCHARGE_DETAIL.filter(
        (children) =>
          children.roomCategory.roomCategoryId ===
          category.roomCategory.roomCategoryId
      );
    let listChildren = [];
    if (listChildrenByCateId.length > 0) {
      listChildren = listChildrenByCateId.map((children) => {
        return {
          key: children.policyDetailId,
          policyDetailId: children.policyDetailId,
          number: children.limitValue,
          price: children.policyValue,
        };
      });
    } else {
      listChildren = [
        {
          number: 1,
          price: 0,
        },
      ];
    }
    // console.log(listChildren);
    return {
      key: i,
      roomCategoryId: category.roomCategory.roomCategoryId,
      listAdult: listAdult,
      listChildren: listChildren,
    };
  });

  const [listPersonFee, setListPersonFee] = useState(listDefaultPersonFee);
  // console.log(listPersonFee);

  const handleAdultAdd = (category) => {
    const newPerson = {
      number: category.listAdult[category.listAdult.length - 1].number + 1,
      price: 0,
    };
    const updateListPersonFee = listPersonFee.map((cate, i) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listAdult: [...cate.listAdult, newPerson],
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListPersonFee(updateListPersonFee);
  };

  const handleAdultRemove = (category, i) => {
    const updateListPersonFee = listPersonFee.map((cate) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listAdult: cate.listAdult.filter((adult, index) => index !== i),
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListPersonFee(updateListPersonFee);
  };

  const handleChildrenAdd = (category) => {
    const newHour = {
      number:
        category.listChildren[category.listChildren.length - 1].number + 1,
      price: 0,
    };
    const updateListPersonFee = listPersonFee.map((cate, i) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listChildren: [...cate.listChildren, newHour],
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListPersonFee(updateListPersonFee);
  };

  const handleChildrenRemove = (category, i) => {
    const updateListPersonFee = listPersonFee.map((cate) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listChildren: cate.listChildren.filter((adult, index) => index !== i),
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListPersonFee(updateListPersonFee);
  };

  return (
    <Form method="post" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-11/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Thiết lập phụ thu thêm người
            </h1>
            <input type="hidden" name="isPersonFee" defaultValue={true} />
            <input
              type="hidden"
              name="numberCategories"
              defaultValue={categories.length}
            />
            <input
              type="hidden"
              name="adultPolicyId"
              defaultValue={props.listAdult.Policy.policyId}
            />
            <input
              type="hidden"
              name="childrenPolicyId"
              defaultValue={props.listChildren.Policy.policyId}
            />
          </div>
          <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead className="bg-blue-100">
              <tr className="text-center">
                <td className="py-2 px-4 w-1/12">Mã hạng phòng</td>
                <td className="py-2 px-4 w-1/12">Tên hạng phòng</td>
                <td className="py-2 px-4 w-2/12">Mức giá</td>
                <td className="py-2 px-4 w-1/12">Tiêu chuẩn</td>
                <td className="py-2 px-4 w-1/12">Tối đa</td>
                <td className="py-2 px-4 w-3/12">Giá thêm người lớn</td>
                <td className="py-2 px-4 w-3/12">Giá thêm trẻ em</td>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, ind) => {
                const cate = listPersonFee.find(
                  (hourFee) =>
                    hourFee.roomCategoryId ===
                    category.roomCategory.roomCategoryId
                );
                return (
                  <tr
                    key={ind}
                    className="border border-gray-300 hover:bg-gray-100"
                  >
                    <td className="py-1 px-2">
                      <div>
                        <h2>{category.roomCategory.roomCategoryId}</h2>
                        <input
                          type="hidden"
                          name={`numberAdult[${ind}]`}
                          value={cate.listAdult.length}
                        />
                        <input
                          type="hidden"
                          name={`numberChildren[${ind}]`}
                          value={cate.listChildren.length}
                        />
                        <input
                          type="hidden"
                          name={`roomCategoryId[${ind}]`}
                          value={cate.roomCategoryId}
                        />
                      </div>
                    </td>
                    <td className="py-1 px-2">
                      <div>{category.roomCategory.roomCategoryName}</div>
                    </td>
                    <td className="py-1 px-2">
                      <table>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-4">Giá giờ</td>
                            <td className="px-4">
                              {category.roomCategory.priceByHour.toLocaleString()}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4">Giá ngày</td>
                            <td className="px-4">
                              {category.roomCategory.priceByDay.toLocaleString()}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4">Giá đêm</td>
                            <td className="px-4">
                              {category.roomCategory.priceByNight.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="py-1 px-2">
                      <table>
                        <tbody>
                          <tr className="border-b">
                            <td>Người lớn</td>
                            <td>{category.roomCategory.numOfAdults}</td>
                          </tr>
                          <tr>
                            <td>Trẻ em</td>
                            <td>{category.roomCategory.numOfChildren}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="py-1 px-2">
                      <table>
                        <tbody>
                          <tr>
                            <td className="border-b">Người lớn</td>
                            <td>{category.roomCategory.numMaxOfAdults}</td>
                          </tr>
                          <tr>
                            <td>Trẻ em</td>
                            <td>{category.roomCategory.numMaxOfChildren}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="py-1 px-2">
                      {cate.listAdult.map((adult, index) => {
                        return (
                          <div>
                            {adult.policyDetailId && (
                              <input
                                type="hidden"
                                name={`policyDetailIdAdult[${ind}][${index}]`}
                                defaultValue={adult.policyDetailId}
                              />
                            )}
                            {category.roomCategory.numOfAdults <
                              category.roomCategory.numMaxOfAdults && (
                              <>
                                Từ người thứ
                                <input
                                  className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                  type="number"
                                  name={`numberAdult[${ind}][${index}]`}
                                  value={adult.number}
                                  onChange={(e) => {
                                    const i = index;
                                    const check = cate.listAdult.map(
                                      (adult, index) => {
                                        if (index === i) {
                                          return {
                                            number: Number(e.target.value),
                                            price: adult.price,
                                          };
                                        } else {
                                          return adult;
                                        }
                                      }
                                    );
                                    const updateListPersonFee =
                                      listPersonFee.map((c) => {
                                        if (
                                          c.roomCategoryId ===
                                          cate.roomCategoryId
                                        ) {
                                          return {
                                            ...cate,
                                            listAdult: check,
                                          };
                                        } else {
                                          return {
                                            ...c,
                                          };
                                        }
                                      });
                                    setListPersonFee(updateListPersonFee);
                                  }}
                                  min={
                                    index > 0
                                      ? cate.listAdult[index - 1].number + 1
                                      : 1
                                  }
                                  max={
                                    index < cate.listAdult.length - 1
                                      ? cate.listAdult[index + 1].number - 1
                                      : category.roomCategory.numMaxOfAdults -
                                        category.roomCategory.numOfAdults
                                  }
                                />
                                giá
                                <input
                                  className="border-0 border-b border-gray-500 w-28 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                  type="number"
                                  name={`priceAdult[${ind}][${index}]`}
                                  value={adult.price}
                                  onChange={(e) => {
                                    const i = index;
                                    const check = cate.listAdult.map(
                                      (adult, index) => {
                                        if (index === i) {
                                          return {
                                            number: adult.number,
                                            price: Number(e.target.value),
                                          };
                                        } else {
                                          return adult;
                                        }
                                      }
                                    );
                                    const updateListPersonFee =
                                      listPersonFee.map((c) => {
                                        if (
                                          c.roomCategoryId ===
                                          cate.roomCategoryId
                                        ) {
                                          return {
                                            ...cate,
                                            listAdult: check,
                                          };
                                        } else {
                                          return {
                                            ...c,
                                          };
                                        }
                                      });
                                    setListPersonFee(updateListPersonFee);
                                  }}
                                  min={0}
                                />
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAdultRemove(cate, index)
                                    }
                                  >
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                      {cate.listAdult[cate.listAdult.length - 1].number <
                        category.roomCategory.numMaxOfAdults -
                          category.roomCategory.numOfAdults && (
                        <div className="text-center mt-2">
                          <button
                            type="button"
                            className="text-blue-500"
                            onClick={() => handleAdultAdd(cate)}
                          >
                            <i className="fa-solid fa-plus mr-2"></i>
                            Thêm người
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-1 px-2">
                      {cate.listChildren.map((children, index) => {
                        return (
                          <div>
                            {children.policyDetailId && (
                              <input
                                type="hidden"
                                name={`policyDetailIdChildren[${ind}][${index}]`}
                                defaultValue={children.policyDetailId}
                              />
                            )}
                            {category.roomCategory.numOfChildren <
                              category.roomCategory.numMaxOfChildren && (
                              <>
                                Từ người thứ
                                <input
                                  className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                  type="number"
                                  name={`numberChildren[${ind}][${index}]`}
                                  value={children.number}
                                  onChange={(e) => {
                                    const i = index;
                                    const check = cate.listChildren.map(
                                      (adult, index) => {
                                        if (index === i) {
                                          return {
                                            number: Number(e.target.value),
                                            price: adult.price,
                                          };
                                        } else {
                                          return adult;
                                        }
                                      }
                                    );
                                    const updateListPersonFee =
                                      listPersonFee.map((c) => {
                                        if (
                                          c.roomCategoryId ===
                                          cate.roomCategoryId
                                        ) {
                                          return {
                                            ...cate,
                                            listChildren: check,
                                          };
                                        } else {
                                          return {
                                            ...c,
                                          };
                                        }
                                      });
                                    setListPersonFee(updateListPersonFee);
                                  }}
                                  min={
                                    index > 0
                                      ? cate.listChildren[index - 1].number + 1
                                      : 1
                                  }
                                  max={
                                    index < cate.listChildren.length - 1
                                      ? cate.listChildren[index + 1].number - 1
                                      : category.roomCategory.numMaxOfChildren -
                                        category.roomCategory.numOfChildren
                                  }
                                />
                                giá
                                <input
                                  className="border-0 border-b border-gray-500 w-28 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                  type="number"
                                  name={`priceChildren[${ind}][${index}]`}
                                  value={children.price}
                                  onChange={(e) => {
                                    const i = index;
                                    const check = cate.listChildren.map(
                                      (adult, index) => {
                                        if (index === i) {
                                          return {
                                            number: adult.number,
                                            price: Number(e.target.value),
                                          };
                                        } else {
                                          return adult;
                                        }
                                      }
                                    );
                                    const updateListPersonFee =
                                      listPersonFee.map((c) => {
                                        if (
                                          c.roomCategoryId ===
                                          cate.roomCategoryId
                                        ) {
                                          return {
                                            ...cate,
                                            listChildren: check,
                                          };
                                        } else {
                                          return {
                                            ...c,
                                          };
                                        }
                                      });
                                    setListPersonFee(updateListPersonFee);
                                  }}
                                  min={0}
                                />
                                {index > 0 && (
                                  <button type="button">
                                    <i
                                      className="fa-solid fa-xmark"
                                      onClick={() =>
                                        handleChildrenRemove(cate, index)
                                      }
                                    ></i>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                      {cate.listChildren[cate.listChildren.length - 1].number <
                        category.roomCategory.numMaxOfChildren -
                          category.roomCategory.numOfChildren && (
                        <div className="text-center mt-2">
                          <button
                            type="button"
                            className="text-blue-500"
                            onClick={() => handleChildrenAdd(cate)}
                          >
                            <i className="fa-solid fa-plus mr-2"></i>
                            Thêm người
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    </Form>
  );
}

export default PersonFeeModal;
