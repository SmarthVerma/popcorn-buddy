"use client";
import { useUploadMovie } from "@/hooks/useUploadMovie";
import { ErrorMessage } from "@hookform/error-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Film, Loader2 } from "lucide-react";

const UploadMovieForm = () => {
  const { errors, isPending, onFormSubmit, register } = useUploadMovie();

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-black/50 backdrop-blur-sm border border-gray-700/50">
      <CardHeader className="space-y-4 text-center border-b border-gray-700/30">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-gray-600">
          <Film className="w-8 h-8 text-gray-200" />
        </div>
        <div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
            Upload Movie
          </CardTitle>
          <CardDescription className="text-lg text-gray-400 mt-2">
            Add a new movie to your collection
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={onFormSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-base font-medium text-gray-200"
            >
              Movie Title
            </Label>
            <Input
              id="title"
              type="text"
              {...register("title")}
              placeholder="Enter movie title"
              className="h-12 text-base bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400"
            />
            <ErrorMessage
              errors={errors}
              name="title"
              render={({ message }) => (
                <p className="text-sm text-red-400 font-medium">{message}</p>
              )}
            />
          </div>

          {/* Genre Field */}
          <div className="space-y-2">
            <Label
              htmlFor="genre"
              className="text-base font-medium text-gray-200"
            >
              Genre
            </Label>
            <Select {...register("genre")}>
              <SelectTrigger className="h-12 text-base bg-gray-900/50 border-gray-600 text-white focus:border-gray-400 focus:ring-gray-400">
                <SelectValue
                  placeholder="Select a genre"
                  className="text-gray-400"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem
                  value="ACTION"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Action
                </SelectItem>
                <SelectItem
                  value="ADVENTURE"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Adventure
                </SelectItem>
                <SelectItem
                  value="COMEDY"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Comedy
                </SelectItem>
                <SelectItem
                  value="DRAMA"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Drama
                </SelectItem>
                <SelectItem
                  value="HORROR"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Horror
                </SelectItem>
                <SelectItem
                  value="ROMANCE"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Romance
                </SelectItem>
                <SelectItem
                  value="SCI_FI"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Sci-Fi
                </SelectItem>
                <SelectItem
                  value="THRILLER"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Thriller
                </SelectItem>
                <SelectItem
                  value="FANTASY"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Fantasy
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.genre && (
              <p className="text-sm text-red-400 font-medium">
                {errors.genre.message}
              </p>
            )}
          </div>

          {/* Platform Field */}
          <div className="space-y-2">
            <Label
              htmlFor="platform"
              className="text-base font-medium text-gray-200"
            >
              Platform
            </Label>
            <Select {...register("platform")}>
              <SelectTrigger className="h-12 text-base bg-gray-900/50 border-gray-600 text-white focus:border-gray-400 focus:ring-gray-400">
                <SelectValue
                  placeholder="Select a platform"
                  className="text-gray-400"
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem
                  value="NETFLIX"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Netflix
                </SelectItem>
                <SelectItem
                  value="AMAZON_PRIME"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Amazon Prime
                </SelectItem>
                <SelectItem
                  value="HOTSTAR"
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Hotstar
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-sm text-red-400 font-medium">
                {errors.platform.message}
              </p>
            )}
          </div>

          {/* Thumbnail Field */}
          <div className="space-y-2">
            <Label
              htmlFor="thumbnail"
              className="text-base font-medium text-gray-200"
            >
              Thumbnail
            </Label>
            <div className="relative">
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                {...register("thumbnail")}
                className="h-12 text-base bg-gray-900/50 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700 transition-colors focus:border-gray-400 focus:ring-gray-400"
              />
              <Upload className="absolute right-3 top-3 h-6 w-6 text-gray-400 pointer-events-none" />
            </div>
            {errors.thumbnail && (
              <p className="text-sm text-red-400 font-medium">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border border-gray-600 text-white transition-all duration-200 shadow-lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload Movie
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadMovieForm;
