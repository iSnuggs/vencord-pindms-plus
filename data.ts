/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChannelType } from "@vencord/discord-types/enums";
import { useForceUpdater } from "@utils/react";
import { ChannelStore, UserStore } from "@webpack/common";

import { PinOrder, PrivateChannelSortStore, settings } from "./index";

export interface Category {
    id: string;
    name: string;
    color: number;
    channels: string[];
    collapsed?: boolean;
}

// Fixed id for the synthetic "Group Chats" category - distinguishes it from
// user-created categories (which get generated ids) everywhere it needs
// special handling (not editable, not deletable, not manually reorderable).
const GROUP_DMS_CATEGORY_ID = "__group_dms__";

export function isGroupDmsCategory(id: string) {
    return id === GROUP_DMS_CATEGORY_ID;
}

let forceUpdateDms: (() => void) | undefined = undefined;
export let currentUserCategories: Category[] = [];

export async function init() {
    const userId = UserStore.getCurrentUser()?.id;
    if (userId == null) return;

    currentUserCategories = settings.store.userBasedCategoryList[userId] ??= [];
    forceUpdateDms?.();
}

export function usePinnedDms() {
    forceUpdateDms = useForceUpdater();
    settings.use([
        "pinOrder", "canCollapseDmSection", "dmSectionCollapsed", "userBasedCategoryList",
        "groupDmsAutoCategory", "groupDmsCategoryCollapsed"
    ]);
}

// Group DMs are detected live from ChannelStore rather than stored anywhere -
// unlike user categories, membership here isn't manually curated, it's just
// "every group DM you're currently in," recomputed on every render.
function getGroupDmChannelIds(): string[] {
    return PrivateChannelSortStore.getPrivateChannelIds()
        .filter(id => ChannelStore.getChannel(id)?.type === ChannelType.GROUP_DM);
}

function getGroupDmsCategory(): Category | null {
    if (!settings.store.groupDmsAutoCategory) return null;

    const channels = getGroupDmChannelIds();
    if (channels.length === 0) return null;

    return {
        id: GROUP_DMS_CATEGORY_ID,
        name: "Group Chats",
        color: 0x5865f2,
        channels,
        collapsed: settings.store.groupDmsCategoryCollapsed
    };
}

// Every accessor below operates on "effective categories" - your manual
// categories with the synthetic Group Chats one prepended (if enabled and
// non-empty), so it consistently renders first.
function getEffectiveCategories(): Category[] {
    const groupDms = getGroupDmsCategory();
    return groupDms ? [groupDms, ...currentUserCategories] : currentUserCategories;
}

export function getCategory(id: string) {
    return getEffectiveCategories().find(c => c.id === id);
}

export function getCategoryByIndex(index: number) {
    return getEffectiveCategories()[index];
}

export function createCategory(category: Category) {
    currentUserCategories.push(category);
}

export function addChannelToCategory(channelId: string, categoryId: string) {
    if (isGroupDmsCategory(categoryId)) return;

    const category = currentUserCategories.find(c => c.id === categoryId);
    if (category == null) return;

    if (category.channels.includes(channelId)) return;

    category.channels.push(channelId);
}

export function removeChannelFromCategory(channelId: string) {
    const category = currentUserCategories.find(c => c.channels.includes(channelId));
    if (category == null) return;

    category.channels = category.channels.filter(c => c !== channelId);
}

export function removeCategory(categoryId: string) {
    if (isGroupDmsCategory(categoryId)) return;

    const categoryIndex = currentUserCategories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;

    currentUserCategories.splice(categoryIndex, 1);
}

export function collapseCategory(id: string, value = true) {
    if (isGroupDmsCategory(id)) {
        settings.store.groupDmsCategoryCollapsed = value;
        return;
    }

    const category = currentUserCategories.find(c => c.id === id);
    if (category == null) return;

    category.collapsed = value;
}

// Utils
export function isPinned(id: string) {
    return getEffectiveCategories().some(c => c.channels.includes(id));
}

export function categoryLen() {
    return getEffectiveCategories().length;
}

export function getAllUncollapsedChannels() {
    const categories = getEffectiveCategories();

    if (settings.store.pinOrder === PinOrder.LastMessage) {
        const sortedChannels = PrivateChannelSortStore.getPrivateChannelIds();
        return categories.filter(c => !c.collapsed).flatMap(c => sortedChannels.filter(channel => c.channels.includes(channel)));
    }

    return categories.filter(c => !c.collapsed).flatMap(c => c.channels);
}

export function getSections() {
    return getEffectiveCategories().reduce((acc, category) => {
        acc.push(category.channels.length === 0 ? 1 : category.channels.length);
        return acc;
    }, [] as number[]);
}

// Move categories - the group DMs category can't be moved, it's always first.
export const canMoveArrayInDirection = (array: any[], index: number, direction: -1 | 1) => {
    const a = array[index];
    const b = array[index + direction];

    return a && b;
};

export const canMoveCategoryInDirection = (id: string, direction: -1 | 1) => {
    if (isGroupDmsCategory(id)) return false;

    const categoryIndex = currentUserCategories.findIndex(m => m.id === id);
    return canMoveArrayInDirection(currentUserCategories, categoryIndex, direction);
};

export const canMoveCategory = (id: string) => !isGroupDmsCategory(id) && (canMoveCategoryInDirection(id, -1) || canMoveCategoryInDirection(id, 1));

export const canMoveChannelInDirection = (channelId: string, direction: -1 | 1) => {
    const category = currentUserCategories.find(c => c.channels.includes(channelId));
    if (category == null) return false;

    const channelIndex = category.channels.indexOf(channelId);
    return canMoveArrayInDirection(category.channels, channelIndex, direction);
};


function swapElementsInArray(array: any[], index1: number, index2: number) {
    if (!array[index1] || !array[index2]) return;
    [array[index1], array[index2]] = [array[index2], array[index1]];
}

export function moveCategory(id: string, direction: -1 | 1) {
    if (isGroupDmsCategory(id)) return;

    const a = currentUserCategories.findIndex(m => m.id === id);
    const b = a + direction;

    swapElementsInArray(currentUserCategories, a, b);
}

export function moveChannel(channelId: string, direction: -1 | 1) {
    const category = currentUserCategories.find(c => c.channels.includes(channelId));
    if (category == null) return;

    const a = category.channels.indexOf(channelId);
    const b = a + direction;

    swapElementsInArray(category.channels, a, b);
}
