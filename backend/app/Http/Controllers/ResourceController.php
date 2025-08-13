<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{

    public function index()
    {
        // Fetch all resources from the database
        $resources = Resource::all();

        return response()->json($resources);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|url',
            'category_id' => 'required|exists:categories,id',
        ]);

        // create the next resource using the validated data
        $resource = Resource::create($validatedData);

        // return the newly create resource with a 201 status code
        return response()->json($resource, 201);
    }

    // Display specified resource
    public function show(Resource $resource)
    {
        return response() -> json($resource);
    }

    // Update specified resource in storage
    public function update(Request $request, Resource $resource)
    {
        // Validate incoming data from the request
        $validatedData = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'link'        => 'sometimes|required|url',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);

        // Update the resource with the validated data
        $resource->update($validatedData);

        // Return the updated resource as a JSON responses
        return response()->json($resource);
    }

    // Remove the specified resource from storage.
    public function destroy(Resource $resource)
    {
        $resource->delete();

        return response()->json(null, 204);
    }
}
