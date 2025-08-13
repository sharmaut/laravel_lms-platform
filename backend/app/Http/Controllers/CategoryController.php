<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    // Display listing of the resource
    public function index()
    {
        return response() -> json(Category::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // create the next resource using the validated data
        $category = Category::create($validatedData);

        // return the newly create resource with a 201 status code
        return response()->json($category, 201);
    }

    // Display specified resource
    public function show(Category $category)
    {
        return response() -> json($category);
    }

    // Update specified resource in storage
    public function update(Request $request, Category $category)
    {
        // Validate incoming data from the request
        $validatedData = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ]);

        // Update the resource with the validated data
        $category->update($validatedData);

        // Return the updated resource as a JSON responses
        return response()->json($category);
    }

    // Remove the specified resource from storage.
    public function destroy(Resource $resource)
    {
        $category->delete();

        return response()->json(null, 204);
    }
}
