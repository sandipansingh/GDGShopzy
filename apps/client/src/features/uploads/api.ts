import { api } from "../../lib/api";
import { ApiResponse, unwrapResponse } from "../../types/api";

export const uploadsApi = {
  uploadProductImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return api
      .post<ApiResponse<{ imageUrl: string; objectKey: string }>>(
        "/uploads/product-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then(unwrapResponse);
  },
};
