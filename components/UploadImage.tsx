import { Image, rem } from "@mantine/core";
import { IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { UploadCloud, XIcon } from "lucide-react";

type Props = {
  coverImage: FileWithPath[];
  setcoverImage: (val: FileWithPath[]) => void;
};

export function UploadImage(props: Props) {
  const previews = props?.coverImage.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        alt="cover image"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  return (
    <div className="relative">
      <Dropzone
        onDrop={props?.setcoverImage}
        onReject={(coverImage) =>
          console.log("rejected coverImage", coverImage)
        }
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        classNames={{
          root: "!bg-transparent !border-gray-500 !p-0",
        }}
      >
        <div className="flex  relative flex-col items-center justify-center !bg-transparent gap-4 w-full h-44  rounded-none">
          {previews?.length ? (
            <div className="relative w-full h-full overflow-hidden ">
              {previews}
            </div>
          ) : (
            <>
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <span className="bg-gray-700 rounded-full p-3">
                  <UploadCloud className="text-gray-100 size-6" />
                </span>
              </Dropzone.Idle>

              <div className="text-center">
                <p className="text-white text-sm font-semibold">
                  Click to upload or{" "}
                  <span className="font-normal text-gray-400">
                    or drag and drop
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </Dropzone>

      {previews?.length > 0 && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            props?.setcoverImage([]);
          }}
          className="absolute top-2 bg-gray-900 text-gray-100 right-2 !z-[999]"
        >
          <XIcon className="size-8 p-2" />
        </span>
      )}
    </div>
  );
}
